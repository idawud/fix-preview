package com.antigravity.fixpreview

data class FixField(
    val tag: String,
    val tagName: String,
    val value: String,
    val enumName: String,
    val description: String,
    val isRepeatingGroup: Boolean = false,
    val section: String = "Body",
    val children: MutableList<MutableList<FixField>>? = null
)

class FixParser(private val schemaLoader: SchemaLoader) {
    private val headerTags = setOf("8", "9", "35", "49", "56", "34", "52", "122", "115", "128", "90", "91", "212", "213", "347", "369", "627", "628", "629", "630")
    private val tailTags = setOf("10", "89", "93")

    fun parse(raw: String): List<FixField> {
        val delimiter = detectDelimiter(raw)
        val parts = raw.split(delimiter).filter { it.contains('=') }

        val fields = mutableListOf<FixField>()
        val stack = mutableListOf<GroupContext>()

        for (part in parts) {
            val keyValue = part.split('=', limit = 2)
            if (keyValue.size < 2) continue
            val tag = keyValue[0]
            val value = keyValue[1]

            val metadata = schemaLoader.getField(tag)
            val enumMetadata = schemaLoader.getEnum(tag, value)

            val isGroupHeader = metadata?.type == "NumInGroup" || (metadata?.name?.startsWith("No") == true && value.toIntOrNull() != null)

            val section = when {
                headerTags.contains(tag) -> "Header"
                tailTags.contains(tag) -> "Tail"
                else -> "Body"
            }

            val field = FixField(
                tag = tag,
                tagName = metadata?.name ?: "Unknown",
                value = value,
                enumName = enumMetadata?.name ?: "",
                description = metadata?.description ?: "",
                isRepeatingGroup = isGroupHeader,
                section = section,
                children = if (isGroupHeader) mutableListOf() else null
            )

            if (isGroupHeader) {
                if (stack.isNotEmpty()) {
                    val currentGroup = stack.last()
                    if (currentGroup.currentEntry == null) {
                        currentGroup.currentEntry = mutableListOf()
                        currentGroup.entries.add(currentGroup.currentEntry!!)
                    }
                    currentGroup.currentEntry!!.add(field)
                } else {
                    fields.add(field)
                }
                stack.add(GroupContext(tag, field.children!!))
                continue
            }

            if (stack.isNotEmpty()) {
                val currentGroup = stack.last()
                // Repeating group logic: if tag already exists in current entry, start new entry
                if (currentGroup.currentEntry != null && currentGroup.currentEntry!!.any { it.tag == tag }) {
                    currentGroup.currentEntry = mutableListOf(field)
                    currentGroup.entries.add(currentGroup.currentEntry!!)
                } else if (currentGroup.currentEntry == null) {
                    currentGroup.currentEntry = mutableListOf(field)
                    currentGroup.entries.add(currentGroup.currentEntry!!)
                } else {
                    currentGroup.currentEntry!!.add(field)
                }
            } else {
                fields.add(field)
            }
        }

        return fields
    }

    private fun detectDelimiter(raw: String): String {
        return if (raw.contains('\u0001')) "\u0001"
        else if (raw.contains('|')) "|"
        else "\u0001"
    }

    private data class GroupContext(
        val noTag: String,
        val entries: MutableList<MutableList<FixField>>,
        var currentEntry: MutableList<FixField>? = null
    )
}
