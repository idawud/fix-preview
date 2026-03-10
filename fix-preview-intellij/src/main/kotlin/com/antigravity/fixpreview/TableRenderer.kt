package com.antigravity.fixpreview

class TableRenderer {
    fun render(fields: List<FixField>): String {
        val headerFields = fields.filter { it.section == "Header" }
        val bodyFields = fields.filter { it.section == "Body" }
        val tailFields = fields.filter { it.section == "Tail" }

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: sans-serif;
                        font-size: 13px;
                        margin: 0;
                        padding: 10px;
                        background-color: #3c3f41; /* Darcula background */
                        color: #afb1b3;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th {
                        position: sticky;
                        top: 0;
                        background: #3c3f41;
                        text-align: left;
                        border-bottom: 2px solid #515151;
                        padding: 8px;
                        z-index: 10;
                    }
                    td {
                        border-bottom: 1px solid #515151;
                        padding: 8px;
                        vertical-align: top;
                    }
                    .tag { color: #cc7832; font-weight: bold; width: 60px; }
                    .field-name { color: #9876aa; width: 150px; }
                    .enum { color: #6a8759; font-style: italic; }
                    .section-header {
                        background-color: #4b4d4d;
                        padding: 8px;
                        font-weight: bold;
                        border-left: 4px solid #cc7832;
                        margin-top: 15px;
                        margin-bottom: 5px;
                        color: #afb1b3;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: 0.9em;
                    }
                    details {
                        margin: 5px 0 5px 20px;
                        border: 1px solid #515151;
                        border-radius: 4px;
                        background: #3c3f41;
                    }
                    summary {
                        padding: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        outline: none;
                    }
                    summary:hover {
                        background: #4b4d4d;
                    }
                    .nested-content {
                        padding: 5px;
                        background: #3c3f41;
                    }
                    .group-header-row {
                        background-color: #4b4d4d;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                ${renderSection("Standard Header", headerFields)}
                ${renderSection("Message Body", bodyFields)}
                ${renderSection("Standard Trailer", tailFields)}
            </body>
            </html>
        """.trimIndent()
    }

    private fun renderSection(title: String, fields: List<FixField>): String {
        if (fields.isEmpty()) return ""
        return """
            <div class="section-header">$title</div>
            <table>
                <thead>
                    <tr>
                        <th class="tag">Tag</th>
                        <th class="field-name">Field Name</th>
                        <th>Value</th>
                        <th>Enum</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderFields(fields)}
                </tbody>
            </table>
        """.trimIndent()
    }

    private fun renderFields(fields: List<FixField>): String {
        val sb = StringBuilder()
        for (field in fields) {
            sb.append("""
                <tr class="${if (field.isRepeatingGroup) "group-header-row" else ""}">
                    <td class="tag">${field.tag}</td>
                    <td class="field-name">${field.tagName}</td>
                    <td>${field.value}</td>
                    <td class="enum">${field.enumName}</td>
                    <td>${field.description}</td>
                </tr>
            """.trimIndent())

            if (field.isRepeatingGroup && field.children != null) {
                sb.append("""
                    <tr>
                        <td colspan="5" style="padding: 0;">
                            ${field.children.mapIndexed { index, entry -> """
                                <details>
                                    <summary>Entry #${index + 1}</summary>
                                    <div class="nested-content">
                                        <table>
                                            <tbody>
                                                ${renderFields(entry)}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            """.trimIndent() }.joinToString("")}
                        </td>
                    </tr>
                """.trimIndent())
            }
        }
        return sb.toString()
    }
}
