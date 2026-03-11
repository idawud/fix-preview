package tech.idawud.fixpreview

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
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 13px;
                        margin: 0;
                        padding: 0;
                        background-color: #2b2b2b; /* IntelliJ Darker background */
                        color: #a9b7c6;
                    }
                    .container {
                        padding: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: fixed;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        vertical-align: top;
                        word-wrap: break-word;
                    }
                    thead th {
                        position: sticky;
                        top: 0;
                        background: #313335;
                        border-bottom: 2px solid #515151;
                        z-index: 100;
                        color: #808080;
                        font-size: 11px;
                        text-transform: uppercase;
                    }
                    /* Fixed widths for alignment */
                    .col-tag { width: 50px; }
                    .col-name { width: 150px; }
                    .col-value { width: 150px; }
                    .col-enum { width: 120px; }
                    .col-desc { width: auto; }

                    /* Responsive Truncation */
                    .description-text {
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        cursor: pointer;
                        max-width: 100%;
                    }
                    .description-text.expanded {
                        white-space: normal;
                        word-break: break-all;
                    }
                    @media (min-width: 600px) {
                        .description-text {
                            white-space: normal;
                            word-break: break-word;
                            cursor: default;
                        }
                    }

                    tr:hover {
                        background-color: #323232;
                    }
                    .tag { color: #cc7832; font-weight: bold; }
                    .field-name { color: #9876aa; }
                    .enum { color: #6a8759; font-style: italic; }
                    
                    details.section {
                        margin-bottom: 2px;
                        border-bottom: 1px solid #323232;
                    }
                    details.section > summary {
                        background-color: #3c3f41;
                        padding: 10px;
                        font-weight: bold;
                        cursor: pointer;
                        outline: none;
                        display: flex;
                        align-items: center;
                        color: #bbbbbb;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        font-size: 12px;
                    }
                    details.section > summary::-webkit-details-marker {
                        display: none;
                    }
                    details.section > summary::before {
                        content: '▶';
                        display: inline-block;
                        width: 15px;
                        transition: transform 0.2s;
                        font-size: 10px;
                        margin-right: 5px;
                    }
                    details.section[open] > summary::before {
                        transform: rotate(90deg);
                    }
                    details.section > summary:hover {
                        background-color: #4b4d4d;
                    }
                    
                    .section-content {
                        padding: 0;
                    }

                    /* Nested repeating groups */
                    details.group {
                        margin: 4px 0 4px 20px;
                        border: 1px solid #414141;
                        border-radius: 2px;
                    }
                    details.group > summary {
                        padding: 6px;
                        background: #323232;
                        font-size: 11px;
                        cursor: pointer;
                    }
                    .group-content {
                        padding: 0;
                    }
                    .group-header-row {
                        background-color: #36393b;
                    }
                </style>
                <script>
                    function toggleSection(id) {
                        const tbody = document.getElementById(id);
                        const row = tbody.previousElementSibling;
                        if (tbody.style.display === 'none') {
                            tbody.style.display = 'table-row-group';
                            row.classList.remove('collapsed');
                        } else {
                            tbody.style.display = 'none';
                            row.classList.add('collapsed');
                        }
                    }

                    function toggleDescription(element) {
                        if (window.innerWidth < 600) {
                            element.classList.toggle('expanded');
                        }
                    }
                </script>
            </head>
            <body>
                <div class="container">
                    <table>
                        <thead>
                            <tr>
                                <th class="col-tag">Tag</th>
                                <th class="col-name">Field Name</th>
                                <th class="col-value">Value</th>
                <table>
                    <thead>
                        <tr>
                            <th class="tag">Tag</th>
                            <th class="field-name">Field Name</th>
                            <th class="value">Value</th>
                            <th class="enum">Enum</th>
                            <th class="description">Description</th>
                        </tr>
                    </thead>
                    ${renderCollapsibleSection("header", "Standard Header", headerFields)}
                    ${renderCollapsibleSection("body", "Message Body", bodyFields)}
                    ${renderCollapsibleSection("tail", "Standard Trailer", tailFields)}
                </table>
            </body>
            </html>
        """.trimIndent()
    }

    private fun renderCollapsibleSection(id: String, title: String, fields: List<FixField>): String {
        if (fields.isEmpty()) return ""
        return """
            <tr class="section-header" onclick="toggleSection('$id')">
                <td colspan="5"><span class="arrow">▼</span> $title</td>
            </tr>
            <tbody id="$id">
                ${renderFields(fields)}
            </tbody>
        """.trimIndent()
    }

    private fun renderFields(fields: List<FixField>): String {
        val sb = StringBuilder()
        for (field in fields) {
            sb.append("""
                <tr class="${if (field.isRepeatingGroup) "group-header-row" else ""}">
                    <td class="tag">${field.tag}</td>
                    <td class="field-name">${field.tagName}</td>
                    <td class="value">${field.value}</td>
                    <td class="enum">${field.enumName}</td>
                    <td class="description">
                        <div class="description-text" onclick="toggleDescription(this)" title="Click to expand/collapse">
                            ${field.description}
                        </div>
                    </td>
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
