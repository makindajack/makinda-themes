# Project Scope

## Vision

**Makinda Themes** is a cross-editor theme family — one consistent visual identity (warm orange accents, deep neutral backgrounds, vibrant syntax) shipped to every major code editor, IDE, and terminal.

The project started as a VS Code extension. It is being expanded into a multi-target theme suite, all generated from a single source of truth so colors stay in sync across every port.

## Companion projects

- **`makinda-icons`** — sibling repo at `~/Downloads/01.GitHub/makinda-icons` housing the icon design (file/folder icons + extension/app icons). Shares the Makinda brand palette but ships independently. Themes and icons are separate extensions/packages so users can mix and match.

## Goals

1. **One brand, every editor.** Identical palette and feel across VS Code, JetBrains, Vim, Sublime, Zed, Xcode, terminals, etc.
2. **Single source of truth.** Define colors once (see [THEMES.md](THEMES.md)) and generate each editor's native format from that spec.
3. **Two variants forever.** `Makinda Light` and `Makinda Dark` ship together everywhere.
4. **High readability.** WCAG AA contrast on text-on-background; comfortable for long sessions.
5. **Zero-config feel.** Users install, pick the theme, and it just looks right — no extra tweaking.

## Non-goals

- Custom fonts (recommendations only — themes don't ship fonts).
- Icon themes (lives in the companion `makinda-icons` repo, not here).
- Per-language micro-tuning beyond what each editor's grammar offers.
- Editors with no theming API (e.g., plain Notepad).

## Repository Layout (target)

```
makinda-themes/
├── source/                      # Single source of truth
│   ├── palette.json             # Raw colors (light + dark)
│   └── tokens.json              # Semantic token mapping
├── build/                       # Generators per editor
│   ├── vscode.mjs
│   ├── jetbrains.mjs
│   ├── sublime.mjs
│   └── ...
├── ports/
│   ├── vscode/                  # Current extension (active)
│   ├── jetbrains/
│   ├── sublime/
│   ├── zed/
│   ├── neovim/
│   ├── xcode/
│   ├── iterm2/
│   ├── alacritty/
│   ├── kitty/
│   └── warp/
├── docs/
│   ├── SCOPE.md                 # This file
│   ├── IDES.md                  # Per-editor status & format notes
│   ├── THEMES.md                # Palette + token spec
│   ├── TODO.md                  # Port checklist
│   ├── DEVELOPMENT.md
│   ├── CONTRIBUTING.md
│   ├── INSTALLATION.md
│   └── PUBLISHING.md
└── README.md
```

> The current repo only contains the `vscode/` port at the root. Restructuring into `ports/vscode/` happens in a dedicated migration step (see [TODO.md](TODO.md)).

## Distribution

| Editor                            | Channel                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| VS Code                           | [Visual Studio Marketplace](https://marketplace.visualstudio.com) + Open VSX           |
| JetBrains                         | [JetBrains Marketplace](https://plugins.jetbrains.com)                                 |
| Sublime Text                      | Package Control                                                                        |
| Zed                               | Zed Extensions registry                                                                |
| Neovim                            | GitHub repo + lazy.nvim/packer install                                                 |
| Xcode                             | GitHub repo + manual install (`~/Library/Developer/Xcode/UserData/FontAndColorThemes`) |
| iTerm2 / Alacritty / Kitty / Warp | GitHub repo `ports/<editor>` direct download                                           |

## Versioning

- All ports share the **same major.minor** version derived from the palette.
- Patch versions can diverge per port for editor-specific fixes.
- Palette changes bump the minor across all ports.
