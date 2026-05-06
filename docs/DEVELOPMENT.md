# Development Guide

This guide covers how to develop and test the Makinda Themes extension locally.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) (v1.74.0 or higher)
- [Node.js](https://nodejs.org/) (v16 or higher, for vsce)
- [Git](https://git-scm.com/)

## Project Structure

```
makinda-themes/
├── themes/
│   ├── Makinda Light-color-theme.json  # Light theme definition
│   └── Makinda Dark-color-theme.json   # Dark theme definition
├── images/
│   ├── icon.png                         # Extension icon
│   ├── icon-light.png                   # Light variant icon
│   └── icon-dark.png                    # Dark variant icon
├── docs/
│   ├── PUBLISHING.md                    # Publishing guide
│   ├── CONTRIBUTING.md                  # Contribution guidelines
│   └── DEVELOPMENT.md                   # This file
├── package.json                         # Extension manifest
├── README.md                            # Marketplace README
├── CHANGELOG.md                         # Version history
└── LICENSE                              # MIT License
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/makindajack/makinda-themes.git
cd makinda-themes
```

### Open in VS Code

```bash
code .
```

### Launch Extension Development Host

1. Press `F5` or go to **Run > Start Debugging**
2. A new VS Code window opens with the theme loaded
3. The theme should automatically activate

## Theme File Structure

The theme is defined in `themes/Makinda Light-color-theme.json`:

```json
{
  "$schema": "vscode://schemas/color-theme",
  "name": "Makinda Light",
  "type": "light",
  "colors": {
    // UI colors (editor, sidebar, tabs, etc.)
  },
  "semanticHighlighting": true,
  "semanticTokenColors": {
    // Semantic token colors
  },
  "tokenColors": [
    // TextMate syntax highlighting rules
  ]
}
```

### Key Sections

#### Colors Object

Defines UI element colors:

- `editor.*` — Editor area
- `sideBar.*` — Sidebar
- `tab.*` — Editor tabs
- `statusBar.*` — Status bar
- `activityBar.*` — Activity bar
- `panel.*` — Bottom panel

#### Token Colors

Defines syntax highlighting using TextMate scopes:

```json
{
  "scope": ["keyword.control", "keyword.operator"],
  "settings": {
    "foreground": "#c73b07"
  }
}
```

#### Semantic Token Colors

Enhanced token colors for supported languages:

```json
{
  "function": "#f05106",
  "variable.readonly": "#1e2022"
}
```

## Making Changes

### Editing Colors

1. Open `themes/Makinda Light-color-theme.json`
2. Make your changes
3. Save the file
4. In the Extension Development Host:
   - Run **Developer: Reload Window** or press `Cmd+R` / `Ctrl+R`

### Finding Scope Names

To identify which scope to target:

1. Open a file in the Extension Development Host
2. Run **Developer: Inspect Editor Tokens and Scopes**
3. Click on any token to see its scope

### Color Guidelines

| Element       | Recommended Color        |
| ------------- | ------------------------ |
| Keywords      | `#c73b07` (deep orange)  |
| Functions     | `#f05106` (brand orange) |
| Strings       | `#0d7377` (teal)         |
| Types/Classes | `#7c3aed` (purple)       |
| Comments      | `#9ca3af` (muted gray)   |
| Numbers       | `#9333ea` (purple-600)   |
| Variables     | `#1e2022` (dark gray)    |

## Testing

### Manual Testing

Test the theme with various file types:

```bash
# Create test files
touch test.js test.py test.html test.css test.json test.md
```

### Checklist

- [ ] JavaScript/TypeScript syntax
- [ ] Python syntax
- [ ] HTML/CSS syntax
- [ ] JSON formatting
- [ ] Markdown rendering
- [ ] Sidebar colors
- [ ] Tab states (active, inactive, hover)
- [ ] Status bar states (normal, debugging, errors)
- [ ] Git decorations
- [ ] Search highlights
- [ ] Terminal colors

## Packaging

### Install vsce

```bash
npm install -g @vscode/vsce
```

### Build Package

```bash
vsce package
```

Creates `makinda-themes-X.X.X.vsix`

### Test Package

```bash
code --install-extension makinda-themes-1.0.0.vsix
```

## Useful Resources

- [Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [Syntax Highlight Guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
- [TextMate Scope Selectors](https://macromates.com/manual/en/scope_selectors)
- [Semantic Highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)

## Debugging Tips

### Theme Not Loading?

1. Check for JSON syntax errors in the theme file
2. Verify `package.json` points to correct theme path
3. Run **Developer: Reload Window**

### Colors Not Updating?

1. Save the theme file
2. Use **Developer: Reload Window** to reload
3. Check VS Code's Output panel for errors

### Find Syntax Errors

Run in terminal:

```bash
cat "themes/Makinda Light-color-theme.json" | python3 -m json.tool > /dev/null
```

If there's no output, the JSON is valid.
