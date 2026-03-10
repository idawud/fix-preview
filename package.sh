#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to show usage
show_usage() {
    echo "Usage: ./package.sh [vscode|intellij|all]"
    echo "  vscode   - Builds and packages the VSCode extension (.vsix)"
    echo "  intellij - Builds and packages the IntelliJ plugin (.zip)"
    echo "  all      - Builds and packages both"
}

# Check if argument is provided
if [ -z "$1" ]; then
    show_usage
    exit 1
fi

package_vscode() {
    echo "--- Packaging VSCode Extension ---"
    cd fix-preview-vscode
    npm install
    npm run compile
    npx vsce package
    echo "VSCode extension packaged successfully!"
    cd ..
}

package_intellij() {
    echo "--- Packaging IntelliJ Plugin ---"
    cd fix-preview-intellij
    # Using gradlew if present, otherwise falling back to gradle
    if [ -f "./gradlew" ]; then
        ./gradlew buildPlugin
    else
        gradle buildPlugin
    fi
    echo "IntelliJ plugin packaged successfully!"
    cd ..
}

case "$1" in
    vscode)
        package_vscode
        ;;
    intellij)
        package_intellij
        ;;
    all)
        package_vscode
        package_intellij
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
