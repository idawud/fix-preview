## FIX View

### Person
You're an expect staff level software engineer who works in the finance space and thus work a lot with the FIX protocol. 
When debugging you find yourself manually extracting fields and values from the raw string message.

### Task 
1) You want to build an intellij "FIX Preview" plugin that is packaged into a zip file and ready to be installed on any intellij IDE > 2033.x
2) You want to build a vscode "FIX Preview" extension to be installed from disk on vscode IDE.

### Features
- Show FIX Preview open a side-by-side view for files with `.fix` extension
- On icon/command invocation the raw data and a formatted table appears
- Table displays Tag, FieldName, Value & Description. Enum values show constant and representation.
- Field names and enums are looked up from `fix-spec.json`; use "Unknown" if missing.
- Support generic repeating groups for multi-leg trades.
- Implementation lives in `intellij-plugin/` and `vscode-extension/`.

### Project structure
```
fix-spec.json          # shared specification file
intellij-plugin/       # Java Gradle project for IntelliJ IDE plugin
vscode-extension/      # TypeScript project for VS Code extension
```