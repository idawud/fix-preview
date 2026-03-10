import * as vscode from 'vscode';
import * as path from 'path';
import { SchemaLoader } from './schemaLoader';
import { FixParser } from './fixParser';
import { TableRenderer } from './tableRenderer';

export async function activate(context: vscode.ExtensionContext) {
    const schemaPath = path.join(context.extensionPath, 'fix_spec');
    // Ensure fix_spec exists or is accessible. In this environment, it's at /root/fix-preview/fix_spec
    const absoluteSchemaPath = '/root/fix-preview/fix_spec'; 
    const schemaLoader = new SchemaLoader(absoluteSchemaPath);
    const parser = new FixParser(schemaLoader);
    const renderer = new TableRenderer();

    let previewPanel: vscode.WebviewPanel | undefined;

    const openPreview = async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        if (previewPanel) {
            previewPanel.reveal(vscode.ViewColumn.Beside);
        } else {
            previewPanel = vscode.window.createWebviewPanel(
                'fixPreview',
                'FIX Preview',
                vscode.ViewColumn.Beside,
                { enableScripts: true }
            );

            previewPanel.onDidDispose(() => {
                previewPanel = undefined;
            }, null, context.subscriptions);
        }

        await updatePreview(editor.document);
    };

    const updatePreview = async (document: vscode.TextDocument) => {
        if (!previewPanel) {
            return;
        }

        const text = document.getText();
        const version = detectVersion(text);
        await schemaLoader.loadVersion(version);
        
        const fields = parser.parse(text);
        const html = renderer.render(fields);
        previewPanel.webview.html = html;
    };

    const detectVersion = (text: string): string => {
        const match = text.match(/8=(FIX\.[^|\x01]+)/);
        return match ? match[1] : 'FIX.4.4';
    };

    context.subscriptions.push(
        vscode.commands.registerCommand('fix-preview.open', openPreview)
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            if (previewPanel && e.document === vscode.window.activeTextEditor?.document) {
                updatePreview(e.document);
            }
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (previewPanel && editor && editor.document.languageId === 'fix') {
                updatePreview(editor.document);
            }
        })
    );
}

export function deactivate() {}
