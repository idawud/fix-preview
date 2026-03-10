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
                        padding: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th {
                        position: sticky;
                        top: 0;
                        background: var(--vscode-editor-background);
                        text-align: left;
                        border-bottom: 2px solid var(--vscode-panel-border);
                        padding: 8px;
                        z-index: 10;
                    }
                    td {
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding: 8px;
                        vertical-align: top;
                    }
                    .tag { color: var(--vscode-symbolIcon-fieldForeground); font-weight: bold; width: 60px; }
                    .field-name { color: var(--vscode-symbolIcon-propertyForeground); width: 150px; }
                    .enum { color: var(--vscode-symbolIcon-enumeratorMemberForeground); font-style: italic; }
                    .section-header {
                        background-color: var(--vscode-editorGroupHeader-tabsBackground);
                        padding: 8px;
                        font-weight: bold;
                        border-left: 4px solid var(--vscode-button-background);
                        margin-top: 15px;
                        margin-bottom: 5px;
                        color: var(--vscode-descriptionForeground);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: 0.9em;
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
                        transition: background 0.2s;
                    }
                    summary:hover {
                        background: var(--vscode-list-hoverBackground);
                    }
                    .nested-content {
                        padding: 5px;
                        background: var(--vscode-editor-background);
                    }
                    .group-header-row {
                        background-color: var(--vscode-list-inactiveSelectionBackground);
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                ${this.renderSection('Standard Header', headerFields)}
                ${this.renderSection('Message Body', bodyFields)}
                ${this.renderSection('Standard Trailer', tailFields)}
            </body>
            </html>
        `;
    }

    private renderSection(title: string, fields: FixField[]): string {
        if (fields.length === 0) return '';
        return `
            <div class="section-header">${title}</div>
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
                    ${this.renderFields(fields)}
                </tbody>
            </table>
        `;
    }

    private renderFields(fields: FixField[]): string {
        return fields.map(field => {
            let html = `
                <tr class="${field.isRepeatingGroup ? 'group-header-row' : ''}">
                    <td class="tag">${field.tag}</td>
                    <td class="field-name">${field.tagName}</td>
                    <td>${field.value}</td>
                    <td class="enum">${field.enumName}</td>
                    <td>${field.description}</td>
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
