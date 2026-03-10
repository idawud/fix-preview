package tech.idawud.fixpreview

import com.intellij.openapi.fileTypes.FileType
import com.intellij.openapi.util.IconLoader
import javax.swing.Icon

object FixFileType : FileType {
    override fun getName() = "FIX"
    override fun getDescription() = "FIX protocol message"
    override fun getDefaultExtension() = "fix"
    override fun getIcon(): Icon? = null // Can add an icon later
    override fun isBinary() = false
}
