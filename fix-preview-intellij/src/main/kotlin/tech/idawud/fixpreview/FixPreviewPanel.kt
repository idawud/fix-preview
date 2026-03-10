package tech.idawud.fixpreview

import com.intellij.openapi.editor.Document
import com.intellij.openapi.editor.event.DocumentEvent
import com.intellij.openapi.editor.event.DocumentListener
import com.intellij.openapi.project.Project
import com.intellij.ui.jcef.JBCefBrowser
import java.awt.BorderLayout
import javax.swing.JPanel

class FixPreviewPanel(
    private val project: Project,
    private val document: Document,
    private val schemaLoader: SchemaLoader
) : JPanel(BorderLayout()) {

    private val browser = JBCefBrowser()
    private val parser = FixParser(schemaLoader)
    private val renderer = TableRenderer()

    init {
        add(browser.component, BorderLayout.CENTER)
        updatePreview()

        document.addDocumentListener(object : DocumentListener {
            override fun documentChanged(event: DocumentEvent) {
                updatePreview()
            }
        })
    }

    private fun updatePreview() {
        val text = document.text
        val version = detectVersion(text)
        schemaLoader.loadVersion(version)
        
        val fields = parser.parse(text)
        val html = renderer.render(fields)
        browser.loadHTML(html)
    }

    private fun detectVersion(text: String): String {
        val regex = Regex("8=(FIX\\.[^|\u0001]+)")
        return regex.find(text)?.groupValues?.get(1) ?: "FIX.4.4"
    }

    fun dispose() {
        browser.dispose()
    }
}
