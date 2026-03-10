package com.antigravity.fixpreview

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.wm.ToolWindowManager
import com.intellij.openapi.wm.RegisterToolWindowTask
import com.intellij.openapi.wm.ToolWindowAnchor

class FixPreviewAction : AnAction() {
    private val schemaLoader = SchemaLoader("/root/fix-preview/fix_spec")

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val editor = e.getData(CommonDataKeys.EDITOR) ?: return
        val document = editor.document

        val toolWindowManager = ToolWindowManager.getInstance(project)
        var toolWindow = toolWindowManager.getToolWindow("FIX Preview")
        
        if (toolWindow == null) {
            toolWindow = toolWindowManager.registerToolWindow(
                RegisterToolWindowTask(
                    id = "FIX Preview",
                    anchor = ToolWindowAnchor.RIGHT,
                    canCloseContent = true
                )
            )
        }

        val contentManager = toolWindow.contentManager
        val content = contentManager.factory.createContent(
            FixPreviewPanel(project, document, schemaLoader),
            "Preview",
            false
        )
        contentManager.removeAllContents(true)
        contentManager.addContent(content)
        toolWindow.show()
    }

    override fun update(e: AnActionEvent) {
        val file = e.getData(CommonDataKeys.VIRTUAL_FILE)
        e.presentation.isEnabledAndVisible = file?.extension == "fix"
    }
}
