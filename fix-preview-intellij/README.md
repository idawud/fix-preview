# FIX Preview for IntelliJ

A powerful, side-by-side previewer for FIX (Financial Information eXchange) protocol messages.

![Icon](src/main/resources/META-INF/pluginIcon.png)

## Features

- **Side-by-Side Preview**: View raw FIX messages alongside a human-readable, structured table.
- **Collapsible Sections**: Easily collapse/expand Standard Header, Body, and Trailer.
- **Support for Multi-entry Groups**: Correctly identifies and groups repeating entries (e.g., Parties).
- **Custom Schema Support**: (Planned) Support for custom FIX versions.

## Installation

1. Open IntelliJ IDEA.
2. Go to `Settings` -> `Plugins`.
3. Search for "FIX Preview".
4. Click `Install`.

## Usage

Right-click on any `.fix` file in the project view or editor tab and select **Open FIX Preview**.
