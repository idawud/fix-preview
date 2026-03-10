import { FixField } from './fixParser';

export class TableRenderer {
    public render(fields: FixField[]): string {
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
                        margin-top: 10px;
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
                    tr:hover {
                        background-color: var(--vscode-list-hoverBackground);
                    }
                    .tag { color: var(--vscode-symbolIcon-fieldForeground); font-weight: bold; }
                    .field-name { color: var(--vscode-symbolIcon-propertyForeground); }
                    .enum { color: var(--vscode-symbolIcon-enumeratorMemberForeground); font-style: italic; }
                    .repeating-group {
                        background-color: var(--vscode-sideBar-background);
                        border-left: 4px solid var(--vscode-button-background);
                    }
                    .nested-table {
                        margin: 5px 0 5px 20px;
                        width: calc(100% - 20px);
                        border: 1px solid var(--vscode-panel-border);
                    }
                    .group-header {
                        background-color: var(--vscode-list-inactiveSelectionBackground);
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
                        ${this.renderFields(fields)}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    }

    private renderFields(fields: FixField[]): string {
        return fields.map(field => {
            let html = `
                <tr class="${field.isRepeatingGroup ? 'group-header' : ''}">
                    <td class="tag">${field.tag}</td>
                    <td class="field-name">${field.tagName}</td>
                    <td>${field.value}</td>
                    <td class="enum">${field.enumName}</td>
                    <td>${field.description}</td>
                </tr>
            `;

            if (field.isRepeatingGroup && field.children) {
                field.children.forEach((entry, index) => {
                    html += `
                        <tr class="repeating-group">
                            <td colspan="5" style="padding: 0;">
                                <table class="nested-table">
                                    <thead>
                                        <tr><th colspan="5">Entry #${index + 1}</th></tr>
                                    </thead>
                                    <tbody>
                                        ${this.renderFields(entry)}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    `;
                });
            }

            return html;
        }).join('');
    }
}
