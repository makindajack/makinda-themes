# Installation Guide

This guide covers all methods for installing the Makinda Themes extension.

## Prerequisites

- Visual Studio Code version 1.74.0 or higher
- Active internet connection (for marketplace installation)

## Installation Methods

### Method 1: VS Code Marketplace (Recommended)

1. **Open VS Code**

2. **Access Extensions**
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
   - Or click the Extensions icon in the Activity Bar

3. **Search for Theme**
   - Type `Makinda Themes` in the search box
   - Look for the extension by **Jackson Makinda**

4. **Install**
   - Click the **Install** button

5. **Activate a Theme**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type `Color Theme`
   - Select **Makinda Light** or **Makinda Dark**

### Method 2: Quick Open

1. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (macOS)
2. Paste: `ext install makindajack.makinda-themes`
3. Press Enter

### Method 3: VSIX File

For offline installation or pre-release versions:

```bash
# Download the .vsix file from GitHub releases
# Then install via command line:
code --install-extension makinda-themes-1.0.0.vsix
```

Or in VS Code:

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type `Extensions: Install from VSIX...`
3. Select the downloaded `.vsix` file

### Method 4: From Source

```bash
# Clone the repository
git clone https://github.com/makindajack/makinda-themes.git

# Open in VS Code
code makinda-themes

# Press F5 to launch Extension Development Host
# The theme will be available in the new window
```

## Compatible Editors

Makinda Themes is a standard VS Code color-theme extension, so it runs in every editor that consumes the VS Code extension format. Pick the install path that matches your editor's marketplace.

### Cursor

Cursor reuses the VS Code extension API and ships its own copy of the Marketplace, so the extension installs the same way as in VS Code.

1. Open Cursor → **Extensions** (`⌘⇧X` / `Ctrl+Shift+X`).
2. Search `Makinda Themes` (publisher: `makindajack`).
3. Click **Install** → then `⌘K ⌘T` / `Ctrl+K Ctrl+T` and choose **Makinda Light** or **Makinda Dark**.

If your Cursor build is pinned to Open VSX instead of the VS Code Marketplace, install with:

```bash
cursor --install-extension makindajack.makinda-themes
```

### Windsurf (Codeium)

Windsurf ships with the Open VSX marketplace by default.

1. Open Windsurf → **Extensions**.
2. Search `Makinda Themes` (publisher: `makindajack`) — the listing comes from <https://open-vsx.org/extension/makindajack/makinda-themes>.
3. Install, then activate the theme exactly as in VS Code.

CLI alternative:

```bash
windsurf --install-extension makindajack.makinda-themes
```

### VSCodium / code-server / Gitpod / other forks

Any fork that uses the Open VSX registry can install via Extensions search or:

```bash
codium --install-extension makindajack.makinda-themes
# code-server: same flag, just substitute the binary
```

### Offline / air-gapped (any of the above)

Download `makinda-themes-<version>.vsix` from [GitHub Releases](https://github.com/makindajack/makinda-themes/releases) and install with the editor's `--install-extension` flag, or via **Command Palette → Extensions: Install from VSIX…**.

> Tip: regardless of editor, you can enable OS-appearance auto-switching with `window.autoDetectColorScheme` + `workbench.preferredLightColorTheme: "Makinda Light"` + `workbench.preferredDarkColorTheme: "Makinda Dark"` in your settings.

## Verifying Installation

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type `Color Theme`
3. You should see both **Makinda Light** and **Makinda Dark** in the list

## Recommended Companion Extensions

For the best experience, we recommend:

### Icon Themes

- **Nomo Dark Icon Theme** - Minimalist icons that complement our theme
- **Material Product Icons** - Modern product icons

### Fonts

- **JetBrains Mono** - Beautiful font with ligatures
- **Fira Code** - Popular coding font with ligatures

## Recommended VS Code Settings

Add these to your `settings.json` for optimal experience:

```json
{
  "workbench.colorTheme": "Makinda Light",
  "editor.fontFamily": "JetBrains Mono, Fira Code, monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.smoothScrolling": true,
  "workbench.list.smoothScrolling": true,
  "terminal.integrated.smoothScrolling": true
}
```

## Troubleshooting

### Theme Not Appearing

1. Restart VS Code
2. Check if the extension is enabled in Extensions panel
3. Verify VS Code version is 1.74.0+

### Colors Look Wrong

1. Check if another extension is overriding colors
2. Disable other color-related extensions temporarily
3. Reset VS Code settings if needed

### Installation Failed

1. Check internet connection
2. Try clearing VS Code extension cache:

   ```bash
   # Windows
   rd /s /q %USERPROFILE%\.vscode\extensions\makindajack.makinda-themes-*

   # macOS/Linux
   rm -rf ~/.vscode/extensions/makindajack.makinda-themes-*
   ```

3. Reinstall the extension

## Uninstallation

1. Open Extensions panel (`Ctrl+Shift+X`)
2. Find **Makinda Light**
3. Click **Uninstall**

Or via command line:

```bash
code --uninstall-extension makindajack.makinda-themes
```

## Getting Help

- [GitHub Issues](https://github.com/makindajack/makinda-themes/issues)
- [Email Support](mailto:jacksonmakinda@outlook.com)
