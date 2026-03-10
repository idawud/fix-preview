package tech.idawud.fixpreview

import org.w3c.dom.Element
import java.io.File
import javax.xml.parsers.DocumentBuilderFactory

data class FieldMetadata(val tag: String, val name: String, val type: String, val description: String)
data class EnumMetadata(val tag: String, val value: String, val name: String, val description: String)

class SchemaLoader(private val schemaPath: String) {
    private val fields = mutableMapOf<String, FieldMetadata>()
    private val enums = mutableMapOf<String, MutableMap<String, EnumMetadata>>()

    fun loadVersion(version: String) {
        val versionDir = File(schemaPath, "$version/Base")
        if (!versionDir.exists()) return

        val fieldsFile = File(versionDir, "Fields.xml")
        val enumsFile = File(versionDir, "Enums.xml")

        if (fieldsFile.exists()) parseFields(fieldsFile)
        if (enumsFile.exists()) parseEnums(enumsFile)
    }

    private fun parseFields(file: File) {
        val dbFactory = DocumentBuilderFactory.newInstance()
        val dBuilder = dbFactory.newDocumentBuilder()
        val doc = dBuilder.parse(file)
        doc.documentElement.normalize()

        val nList = doc.getElementsByTagName("Field")
        for (i in 0 until nList.length) {
            val node = nList.item(i)
            if (node is Element) {
                val tag = node.getElementsByTagName("Tag").item(0)?.textContent ?: ""
                val name = node.getElementsByTagName("Name").item(0)?.textContent ?: ""
                val type = node.getElementsByTagName("Type").item(0)?.textContent ?: ""
                val description = node.getElementsByTagName("Description").item(0)?.textContent ?: ""
                fields[tag] = FieldMetadata(tag, name, type, description)
            }
        }
    }

    private fun parseEnums(file: File) {
        val dbFactory = DocumentBuilderFactory.newInstance()
        val dBuilder = dbFactory.newDocumentBuilder()
        val doc = dBuilder.parse(file)
        doc.documentElement.normalize()

        val nList = doc.getElementsByTagName("Enum")
        for (i in 0 until nList.length) {
            val node = nList.item(i)
            if (node is Element) {
                val tag = node.getElementsByTagName("Tag").item(0)?.textContent ?: ""
                val value = node.getElementsByTagName("Value").item(0)?.textContent ?: ""
                val name = node.getElementsByTagName("SymbolicName").item(0)?.textContent ?: ""
                val description = node.getElementsByTagName("Description").item(0)?.textContent ?: ""
                
                enums.getOrPut(tag) { mutableMapOf() }[value] = EnumMetadata(tag, value, name, description)
            }
        }
    }

    fun getField(tag: String) = fields[tag]
    fun getEnum(tag: String, value: String) = enums[tag]?.get(value)
}
