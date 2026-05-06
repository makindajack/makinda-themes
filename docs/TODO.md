# TODO — Multi-Editor Port

Tracking the expansion of Makinda Themes from VS Code-only to a cross-editor theme suite. See [SCOPE.md](SCOPE.md), [IDES.md](IDES.md), and [THEMES.md](THEMES.md) for context.

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Phase 0 — Foundation

- [ ] Extract palette from current VS Code JSONs into `source/palette.json`
- [ ] Define semantic token map in `source/tokens.json` (mirrors [THEMES.md](THEMES.md))
- [ ] Add a Node build script (`build/index.mjs`) that regenerates the VS Code themes from the source
- [ ] Verify generated VS Code JSON is byte-identical to the hand-tuned files (or capture the diff intentionally)
- [ ] Add `npm run build` and `npm run check` (lint + contrast audit)
- [ ] Restructure repo into `ports/vscode/` (keep current marketplace package working — bump path in `package.json` once moved)

## Phase 1 — VS Code polish (current port)

- [ ] Audit contrast on every `editor.foreground` vs `editor.background` pair (target AA on UI, AAA on text)
- [ ] Fix Light theme `editorLineNumber.activeForeground` so the current line is unambiguous
- [ ] Verify Dark theme `terminal.ansi*` slots match [THEMES.md](THEMES.md) ANSI table
- [ ] Add semantic token coverage for: TypeScript decorators, Rust lifetimes, Python `self`, Go receiver types
- [ ] Add screenshots to `images/` for: TS, Python, Rust, Go, Markdown, JSON, HTML/JSX
- [ ] Publish to **Open VSX** (mirror of VS Code Marketplace) so VSCodium / Cursor / Windsurf users get auto-updates

## Phase 2 — Adjacent VS Code ecosystem

- [x] Cursor — works as-is via VS Code extension
- [x] Windsurf — works as-is
- [ ] Document install steps for Cursor / Windsurf in `INSTALLATION.md`
- [ ] Add a "Compatible editors" section to `README.md`

## Phase 3 — JetBrains

- [ ] Scaffold `ports/jetbrains/` Gradle plugin project (`gradle-intellij-plugin`)
- [ ] Generate `Makinda Light.icls` (editor color scheme) from source
- [ ] Generate `Makinda Light.theme.json` (UI theme) from source
- [ ] Same pair for Dark
- [ ] Test in IntelliJ IDEA Community
- [ ] Test in WebStorm, PyCharm, GoLand, RustRover, Rider, Android Studio
- [ ] Write `plugin.xml` with both themes registered
- [ ] Submit to JetBrains Marketplace

## Phase 4 — Sublime Text

- [ ] Scaffold `ports/sublime/`
- [ ] Generate `Makinda Light.sublime-color-scheme` from source
- [ ] Generate Dark variant
- [ ] Add `messages.json` and `package.json` for Package Control
- [ ] Submit to Package Control

## Phase 5 — Zed

- [ ] Scaffold `ports/zed/extension.toml`
- [ ] Generate `themes/makinda.json` containing both variants
- [ ] Test in Zed
- [ ] Submit to Zed extension registry

## Phase 6 — Neovim & Vim

- [ ] Scaffold `ports/neovim/lua/makinda/`
- [ ] Generate `init.lua` with `setup({ variant = "light" | "dark" })`
- [ ] Cover Treesitter highlight groups
- [ ] Cover LSP semantic tokens
- [ ] Cover diagnostics, gitsigns, telescope, nvim-tree/neo-tree, lualine
- [ ] Generate Vim fallback `colors/makinda-light.vim` and `colors/makinda-dark.vim`
- [ ] Cterm (256-color) fallback table
- [ ] README install instructions for lazy.nvim / packer / vim-plug

## Phase 7 — Xcode

- [ ] Scaffold `ports/xcode/`
- [ ] Generate `Makinda Light.xccolortheme` (plist) from source
- [ ] Generate Dark variant
- [ ] Manual install script `install.sh`
- [ ] README with screenshots in Xcode

## Phase 8 — Helix

- [ ] Generate `ports/helix/makinda_light.toml`
- [ ] Generate `ports/helix/makinda_dark.toml`
- [ ] Submit upstream PR to Helix's `runtime/themes/` directory

## Phase 9 — Terminals

- [ ] iTerm2 — `ports/iterm2/Makinda Light.itermcolors`, `…Dark.itermcolors`
- [ ] Warp — `ports/warp/makinda_light.yaml`, `…dark.yaml`
- [ ] Alacritty — `ports/alacritty/makinda_light.toml`, `…dark.toml`
- [ ] Kitty — `ports/kitty/makinda_light.conf`, `…dark.conf`
- [ ] WezTerm — `ports/wezterm/makinda.lua`
- [ ] Windows Terminal — JSON snippet in `ports/windows-terminal/`
- [ ] Ghostty — theme file in `ports/ghostty/`

## Phase 10 — Backlog (Tier 3)

- [ ] Emacs `makinda-theme.el`
- [ ] Visual Studio (full) `.vssettings`
- [ ] TextMate `.tmTheme`
- [ ] Notepad++ XML
- [ ] Eclipse `.epf`
- [ ] BBEdit, Nova, Lapce
- [ ] Slack, Discord (BetterDiscord), Obsidian CSS

## Cross-cutting fixes

- [ ] Add CI (GitHub Actions): lint JSON, run build, run contrast check
- [ ] Add `scripts/contrast-check.mjs` — fails on AA violations for body text
- [ ] Add screenshot generator (Playwright + a reference snippet) to keep marketing PNGs in sync
- [ ] Single `release.mjs` that bumps version across every port and tags

## Known issues to fix

- [ ] Light theme: orange on white can vibrate at small font sizes — consider a slightly darker brand variant for inline accents (`#d94405`?)
- [ ] Dark theme: terminal cursor color blends into selection on some terminals
- [ ] Inconsistent comment color between Light (`#9ca3af`) and Dark (`#6b7280`) — confirm intentional vs. swap

---

**Next up:** Phase 0 (foundation) — once the source-of-truth pipeline exists, every later port becomes a generator file.
