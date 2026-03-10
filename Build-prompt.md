You are a senior staff software engineer with deep experience in:
- Financial trading systems
- The FIX protocol
- IDE plugin development
- TypeScript, Java/Kotlin
- VSCode Extension API
- IntelliJ Platform SDK

Your task is to build two developer tools that preview FIX protocol messages in a readable format similar to the Markdown Preview feature.

--------------------------------

PROJECT GOAL

Create:

1) A VSCode Extension called "FIX Preview"
2) An IntelliJ Plugin called "FIX Preview"

Both tools should allow developers to preview raw FIX protocol messages as a structured table.

The preview behavior should be very similar to how Markdown preview works in IDEs (side-by-side live preview).

--------------------------------

INPUT

The input is a raw FIX message string such as:

8=FIX.4.4|9=176|35=D|49=CLIENT12|56=BROKER12|11=12345|21=1|55=AAPL|54=1|60=20240101-12:01:01|38=100|40=2|44=180.50|10=128|

Delimiter may be:
- `|`
- ASCII SOH `\x01`

--------------------------------

OUTPUT PREVIEW

Display the parsed message as a table with the columns:

| Tag | Field Name | Value | Enum | Description |

Example:

| Tag | Field Name | Value | Enum | Description |
|----|----|----|----|----|
| 35 | MsgType | D | NewOrderSingle | New Order |
| 55 | Symbol | AAPL |  | Instrument Symbol |
| 54 | Side | 1 | Buy | Buy |
| 40 | OrdType | 2 | Limit | Limit Order |

--------------------------------

SCHEMA SOURCE

Field definitions must be resolved using FIX XML specification files.

The schema folder contains:

FIX.4.0/
FIX.4.1/
FIX.4.2/
FIX.4.3/
FIX.4.4/
FIX.5.0/
FIX.5.0SP1/
FIX.5.0SP2/

Each version contains:

Fields.xml
Enums.xml
Datatypes.xml
Messages.xml
Components.xml

The extension must load these files and map:

Tag → FieldName
EnumValue → EnumName
Field → Description

If lookup fails, show:

FieldName = "Unknown"
Enum = ""
Description = ""

--------------------------------

FEATURES

1) File Association

When opening files with extension:

.fix

Enable FIX preview.

--------------------------------

2) Side-by-Side Preview

Provide command:

VSCode:
"Open FIX Preview"

IntelliJ:
"Open FIX Preview"

It should open a side-by-side panel like Markdown preview.

Left panel:
raw FIX message

Right panel:
parsed table preview

--------------------------------

3) Live Update

Whenever the FIX message changes, update preview automatically.

--------------------------------

4) FIX Parsing

Steps:

1) Detect delimiter
2) Split fields
3) Extract Tag=Value
4) Lookup metadata from schema
5) Build preview table

--------------------------------

5) Repeating Groups

Handle repeating groups generically.

Example:

453=2
448=PARTY1
447=D
452=1
448=PARTY2
447=D
452=3

Render groups as nested table sections.

--------------------------------

6) UX

Table should be:

sortable
clean
similar to markdown preview styling

--------------------------------

IMPLEMENTATION REQUIREMENTS

VSCode extension:

Language:
TypeScript

Use:
VSCode Webview API

Project structure:

/fix-preview-vscode
  package.json
  extension.ts
  fixParser.ts
  schemaLoader.ts
  webview.html
  tableRenderer.ts

Provide full working extension code.

--------------------------------

IntelliJ plugin:

Language:
Kotlin (preferred) or Java

Use:
IntelliJ Platform SDK

Project structure:

/fix-preview-intellij
  plugin.xml
  FixPreviewAction.kt
  FixParser.kt
  SchemaLoader.kt
  FixPreviewPanel.kt

Provide full working plugin code.

--------------------------------

UI RENDERING

Preview table should be rendered as HTML.

Use:

- simple CSS
- responsive table
- sticky header

--------------------------------

INSTALLATION

VSCode:

Generate installable extension via:

vsce package

Produces:

fix-preview-x.x.x.vsix

--------------------------------

IntelliJ:

Generate plugin ZIP using:

gradle buildPlugin

--------------------------------

OUTPUT FORMAT

Provide:

1) Full VSCode extension source
2) Full IntelliJ plugin source
3) Instructions to build both
4) Example FIX message test file
5) Screenshots mockup of preview layout

--------------------------------

IMPORTANT

Design the parser so it supports ANY FIX version automatically by loading schema files dynamically.

--------------------------------

Begin implementation.