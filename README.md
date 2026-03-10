# FIX Preview

A powerful devtool to preview raw FIX protocol messages as structured tables within your IDE.

## Features

- **Side-by-Side Preview**: Live preview panel that updates instantly as you edit raw FIX messages.
- **Dynamic Schema Loading**: Loads FIX XML specifications (FIX 4.0 through 5.0SP2) dynamically to resolve field names and enum values.
- **Repeating Group Support**: Generically handles nested repeating groups (e.g., `NoPartyIDs`) for complex messages.
- **Themed UI**: Modern, clean HTML tables that match your IDE's theme (Dark/Darcula support).

---

## VSCode Extension

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or later)
- [VSCode](https://code.visualstudio.com/) (v1.75.0 or later)

### Build & Package
1. Navigate to the extension directory:
   ```bash
   cd fix-preview-vscode
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the code:
   ```bash
   npm run compile
   ```
4. Package into a `.vsix` file:
   ```bash
   npx vsce package
   ```
   This generates `fix-preview-1.0.0.vsix`.

### Installation
1. Open VSCode.
2. Go to the **Extensions** view (`Ctrl+Shift+X`).
3. Click the `...` (Views and More Actions) menu in the top right.
4. Select **Install from VSIX...** and choose the generated file.

### How to Use
1. Open any file with a `.fix` extension (e.g., `sample.fix`).
2. Click the **Preview** icon in the editor title bar (top right) or run the command `FIX: Open FIX Preview` from the Command Palette (`Ctrl+Shift+P`).

---

## IntelliJ Plugin

### Prerequisites
- [Java JDK 17](https://www.oracle.com/java/technologies/downloads/)
- [Gradle](https://gradle.org/install/)

### Build & Package
1. Navigate to the plugin directory:
   ```bash
   cd fix-preview-intellij
   ```
2. Build and package the plugin:
   ```bash
   gradle buildPlugin
   ```
   The installable ZIP file will be located at `build/distributions/fix-preview-1.0.0.zip`.

### Installation
1. Open IntelliJ IDEA.
2. Go to `Settings` > `Plugins`.
3. Click the gear icon and select **Install Plugin from Disk...**.
4. Select the generated ZIP file and restart the IDE.

### How to Use
1. Open a `.fix` file.
2. Right-click in the editor and select **Open FIX Preview**.
3. A new tool window titled **FIX Preview** will appear on the right side.

---

## Test Data
You can use the provided [sample.fix](sample.fix) file to test the preview functionality immediately after installation.

## Project Structure
```
/fix_spec               # FIX XML Specification files (v4.0 - v5.0SP2)
/fix-preview-vscode     # VSCode Extension source (TypeScript)
/fix-preview-intellij   # IntelliJ Plugin source (Kotlin)
sample.fix              # Sample FIX messages for testing
```