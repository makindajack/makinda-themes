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

## Repository Layout

```
makinda-themes/
├── source/
│   ├── palette.json             # single source of truth
│   ├── tokens.json              # semantic token mapping
│   └── vscode/                  # VS Code-specific token overrides
├── build/                       # one generator per port
│   ├── lib/resolve.mjs          # palette + token resolver
│   ├── vscode.mjs jetbrains.mjs sublime.mjs zed.mjs neovim.mjs
│   ├── xcode.mjs helix.mjs textmate.mjs emacs.mjs notepad-plus-plus.mjs
│   ├── visual-studio.mjs eclipse.mjs bbedit.mjs nova.mjs lapce.mjs
│   ├── alacritty.mjs kitty.mjs warp.mjs wezterm.mjs ghostty.mjs
│   ├── windows-terminal.mjs iterm2.mjs
│   ├── slack.mjs discord.mjs obsidian.mjs
│   ├── validate.mjs contrast.mjs screenshots.mjs release.mjs
│   └── index.mjs                # runs every port
├── ports/                       # generated outputs per editor
│   ├── jetbrains/ sublime/ zed/ neovim/ xcode/ helix/
│   ├── textmate/ emacs/ notepad-plus-plus/ visual-studio/
│   ├── eclipse/ bbedit/ nova/ lapce/
│   ├── alacritty/ kitty/ warp/ wezterm/ ghostty/
│   ├── windows-terminal/ iterm2/
│   └── slack/ discord/ obsidian/
├── themes/                      # VS Code theme outputs (root extension)
├── images/                      # marketing screenshots (Playwright + Shiki)
├── docs/
│   ├── SCOPE.md IDES.md THEMES.md TODO.md
│   ├── DEVELOPMENT.md CONTRIBUTING.md INSTALLATION.md PUBLISHING.md
└── .github/workflows/{ci,release}.yml
```

The VS Code port lives at the repo root (so the `.vsix` packages directly from `themes/`); all other ports live under `ports/<editor>/`.

## Distribution

| Target                                                                   | Channel                                                                                |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| VS Code / Cursor / Windsurf                                              | [Visual Studio Marketplace](https://marketplace.visualstudio.com) + Open VSX           |
| JetBrains IDEs                                                           | [JetBrains Marketplace](https://plugins.jetbrains.com)                                 |
| Sublime Text                                                             | Package Control                                                                        |
| Zed                                                                      | Zed Extensions registry                                                                |
| Neovim / Vim                                                             | GitHub repo + lazy.nvim/packer/Packer install                                          |
| Xcode                                                                    | GitHub repo + manual install (`~/Library/Developer/Xcode/UserData/FontAndColorThemes`) |
| Helix / Lapce / Emacs                                                    | GitHub repo + per-editor install path                                                  |
| Visual Studio / Eclipse / Notepad++                                      | GitHub repo + import via editor settings UI                                            |
| Nova / BBEdit / TextMate                                                 | GitHub repo (macOS)                                                                    |
| Terminals (iTerm2/Warp/Alacritty/Kitty/WezTerm/Ghostty/Windows Terminal) | GitHub repo `ports/<editor>` direct download                                           |
| Slack / Discord / Obsidian                                               | GitHub repo `ports/<app>` snippet/CSS                                                  |

## Versioning

- All ports share the **same major.minor** version derived from the palette.
- Patch versions can diverge per port for editor-specific fixes.
- Palette changes bump the minor across all ports.
