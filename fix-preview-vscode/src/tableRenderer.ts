import { FixField } from './fixParser';

export class TableRenderer {
    public render(fields: FixField[]): string {
        const headerFields = fields.filter(f => f.section === 'Header');
        const bodyFields = fields.filter(f => f.section === 'Body');
        const tailFields = fields.filter(f => f.section === 'Tail');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        font-size: var(--vscode-font-size);
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-editor-background);
                        margin: 0;
                        padding: 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: fixed;
                    }
                    thead th {
                        position: sticky;
                        top: 0;
                        background: var(--vscode-editor-background);
                        text-align: left;
                        border-bottom: 2px solid var(--vscode-panel-border);
                        padding: 8px;
                        z-index: 100;
                    }
                    td {
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding: 8px;
                        vertical-align: top;
                        word-break: break-word;
                    }
                    .tag { width: 60px; color: var(--vscode-symbolIcon-fieldForeground); font-weight: bold; }
                    .field-name { width: 180px; color: var(--vscode-symbolIcon-propertyForeground); }
                    .value { width: 200px; }
                    .enum { width: 180px; color: var(--vscode-symbolIcon-enumeratorMemberForeground); font-style: italic; }
                    .description { width: auto; color: var(--vscode-descriptionForeground); }

                    .section-header {
                        background-color: var(--vscode-editorGroupHeader-tabsBackground);
                        cursor: pointer;
                        user-select: none;
                        font-weight: bold;
                    }
                    .section-header td {
                        padding: 10px 8px;
                        border-bottom: 2px solid var(--vscode-button-background);
                        color: var(--vscode-button-background);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: 0.9em;
                    }
                    .section-header:hover {
                        background-color: var(--vscode-list-hoverBackground);
                    }
                    .arrow {
                        display: inline-block;
                        width: 20px;
                        transition: transform 0.2s;
                    }
                    .collapsed .arrow {
                        transform: rotate(-90deg);
                    }
                    .group-header-row {
                        background-color: var(--vscode-list-inactiveSelectionBackground);
                        font-weight: bold;
                    }
                    details {
                        margin: 5px 0 5px 20px;
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 4px;
                        background: var(--vscode-sideBar-background);
                    }
                    summary {
                        padding: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        outline: none;
                    }
                    .nested-content {
                        padding: 5px;
                        background: var(--vscode-editor-background);
                    }
                    .nested-content table {
                        table-layout: auto;
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
                </script>
            </head>
            <body>
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
                    ${this.renderCollapsibleSection('header', 'Standard Header', headerFields)}
                    ${this.renderCollapsibleSection('body', 'Message Body', bodyFields)}
                    ${this.renderCollapsibleSection('tail', 'Standard Trailer', tailFields)}
                </table>
            </body>
            </html>
        `;
    }

    private renderCollapsibleSection(id: string, title: string, fields: FixField[]): string {
        if (fields.length === 0) return '';
        return `
            <tr class="section-header" onclick="toggleSection('${id}')">
                <td colspan="5"><span class="arrow">▼</span> ${title}</td>
            </tr>
            <tbody id="${id}">
                ${this.renderFields(fields)}
            </tbody>
        `;
    }

    private renderFields(fields: FixField[]): string {
        return fields.map(field => {
            let html = `
                <tr class="${field.isRepeatingGroup ? 'group-header-row' : ''}">
                    <td class="tag">${field.tag}</td>
                    <td class="field-name">${field.tagName}</td>
                    <td class="value">${field.value}</td>
                    <td class="enum">${field.enumName}</td>
                    <td class="description">${field.description}</td>
                </tr>
            `;

            if (field.isRepeatingGroup && field.children) {
                html += `
                    <tr>
                        <td colspan="5" style="padding: 0;">
                            ${field.children.map((entry, index) => `
                                <details>
                                    <summary>Entry #${index + 1}</summary>
                                    <div class="nested-content">
                                        <table>
                                            <tbody>
                                                ${this.renderFields(entry)}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            `).join('')}
                        </td>
                    </tr>
                `;
            }

            return html;
        }).join('');
    }
}
