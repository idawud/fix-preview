package com.antigravity.fixpreview

class TableRenderer {
    fun render(fields: List<FixField>): String {
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
                        margin-top: 10px;
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
                    .tag { color: #cc7832; font-weight: bold; }
                    .field-name { color: #9876aa; }
                    .enum { color: #6a8759; font-style: italic; }
                    .nested-table {
                        margin: 5px 0 5px 20px;
                        width: calc(100% - 20px);
                        border: 1px solid #515151;
                    }
                    .group-header {
                        background-color: #4b4d4d;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th>Tag</th>
                            <th>Field Name</th>
                            <th>Value</th>
                            <th>Enum</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderFields(fields)}
                    </tbody>
                </table>
            </body>
            </html>
        """.trimIndent()
    }

    private fun renderFields(fields: List<FixField>): String {
        val sb = StringBuilder()
        for (field in fields) {
            sb.append("""
                <tr class="${if (field.isRepeatingGroup) "group-header" else ""}">
                    <td class="tag">${field.tag}</td>
                    <td class="field-name">${field.tagName}</td>
                    <td>${field.value}</td>
                    <td class="enum">${field.enumName}</td>
                    <td>${field.description}</td>
                </tr>
            """.trimIndent())

            if (field.isRepeatingGroup && field.children != null) {
                field.children.forEachIndexed { index, entry ->
                    sb.append("""
                        <tr class="repeating-group">
                            <td colspan="5" style="padding: 0;">
                                <table class="nested-table">
                                    <thead>
                                        <tr><th colspan="5">Entry #${index + 1}</th></tr>
                                    </thead>
                                    <tbody>
                                        ${renderFields(entry)}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    """.trimIndent())
                }
            }
        }
        return sb.toString()
    }
}
