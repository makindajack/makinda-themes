# TODO — Multi-Editor Port

Tracking the expansion of Makinda Themes from VS Code-only to a cross-editor theme suite. See [SCOPE.md](SCOPE.md), [IDES.md](IDES.md), and [THEMES.md](THEMES.md) for context.

> **Companion repo:** icon design lives in `~/Downloads/01.GitHub/makinda-icons` (`makinda-icons`). Out of scope for this checklist; tracked separately.

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Phase 0 — Foundation

- [x] Extract palette from current VS Code JSONs into `source/palette.json`
- [x] Define semantic token map in `source/tokens.json` (mirrors [THEMES.md](THEMES.md))
- [x] Add a Node validator (`build/validate.mjs`) that flags theme colors not in the palette
- [x] Wire `npm run validate` / `npm run validate:strict` into `package.json`
- [x] Resolve all stragglers — `npm run validate:strict` is green for both variants
- [x] Add a Node build script (`build/vscode.mjs`) that regenerates the VS Code themes from `source/vscode/{light,dark}.json`
- [x] Verify generated VS Code JSON is byte-identical to the hand-tuned files
- [x] Add `npm run build` and `npm run check` (validate + contrast audit)
- [x] Repo layout decided: `themes/` + `package.json` stay at the root **(this is the VS Code port)**; every other port lives under `ports/<editor>/`. Moving `themes/` would force a marketplace path change for zero functional gain.

## Phase 1 — VS Code polish (current port)

- [x] Audit contrast on every `editor.foreground` vs `editor.background` pair (target AA on UI, AAA on text) — `npm run contrast`, two intentional brand-orange shortfalls tracked as advisory
- [x] Fix Light theme `editorLineNumber.activeForeground` so the current line is unambiguous — already strong (`#1e2022` active vs `#cfd2d6` inactive)
- [x] Verify Dark theme `terminal.ansi*` slots match [THEMES.md](THEMES.md) ANSI table — reconciled palette ↔ theme ↔ spec; palette is canonical
- [x] Add semantic token coverage for: TypeScript decorators, Rust lifetimes, Python `self`, Go receiver types
- [x] Document OS-appearance auto-switching in the README (`window.autoDetectColorScheme` + preferred light/dark)
- [x] Add Open VSX publishing flow to [PUBLISHING.md](PUBLISHING.md) so VSCodium / Cursor / Windsurf get auto-updates
- [ ] Add screenshots to `images/` for: TS, Python, Rust, Go, Markdown, JSON, HTML/JSX (manual capture — see checklist below)
- [x] Run `vsce publish` (Marketplace) and `ovsx publish` (Open VSX) for `1.0.2`

### Screenshot capture checklist (manual)

Capture each at 1600×1000 with the same window chrome and font (Fira Code 14, line height 1.6):

- [ ] `images/light-typescript.png` and `images/dark-typescript.png` — a real `.tsx` file with imports, a class, decorators, JSX
- [ ] `images/light-python.png` / `images/dark-python.png` — class with type hints, `self`, decorators, f-strings
- [ ] `images/light-rust.png` / `images/dark-rust.png` — struct + impl, lifetimes, attributes
- [ ] `images/light-go.png` / `images/dark-go.png` — receiver methods, struct tags, error handling
- [ ] `images/light-markdown.png` / `images/dark-markdown.png` — headings, code fences, links, lists
- [ ] `images/light-json.png` / `images/dark-json.png` — package.json or similar nested structure
- [ ] `images/light-html.png` / `images/dark-html.png` — HTML/JSX with attributes

### Marketplace migration (`makinda-dark` → `makinda-themes`)

The Dark variant used to ship as the standalone extension `makindajack.makinda-dark`. Now that both variants live together in `makindajack.makinda-themes`, the old listing has to be retired. See [PUBLISHING.md → Migrating from `makinda-dark`](PUBLISHING.md#migrating-from-makinda-dark-one-time) for steps.

- [x] Push a final `makinda-dark` patch release whose README points users to `makinda-themes` (optional but friendly)
- [x] **Unpublish `makindajack.makinda-dark`** from the VS Code Marketplace (publisher portal)
- [x] Confirm only `makinda-themes` is listed at <https://marketplace.visualstudio.com/publishers/makindajack>
- [x] Publish the latest `makinda-themes` (after build script lands) to VS Code Marketplace and Open VSX
- [ ] Update marketplace README screenshots to show both Light and Dark

## Phase 2 — Adjacent VS Code ecosystem

- [x] Cursor — works as-is via VS Code extension
- [x] Windsurf — works as-is
- [x] Document install steps for Cursor / Windsurf in `INSTALLATION.md`
- [x] Add a "Compatible editors" section to `README.md`

## Phase 3 — JetBrains

- [x] Scaffold `ports/jetbrains/` Gradle plugin project (`gradle-intellij-plugin`)
- [x] Generate `Makinda Light.icls` (editor color scheme) from source
- [x] Generate `Makinda Light.theme.json` (UI theme) from source
- [x] Same pair for Dark
- [x] Write `plugin.xml` with both themes registered
- [ ] Test in IntelliJ IDEA Community (`./gradlew runIde`) — manual
- [ ] Test in WebStorm, PyCharm, GoLand, RustRover, Rider, Android Studio — manual
- [ ] Submit to JetBrains Marketplace

## Phase 4 — Sublime Text

- [x] Scaffold `ports/sublime/`
- [x] Generate `Makinda Light.sublime-color-scheme` from source
- [x] Generate Dark variant
- [x] Add `messages.json` and `package.json` for Package Control
- [ ] Submit to Package Control

## Phase 5 — Zed

- [x] Scaffold `ports/zed/extension.toml`
- [x] Generate `themes/makinda.json` containing both variants
- [ ] Test in Zed
- [ ] Submit to Zed extension registry

## Phase 6 — Neovim & Vim

- [x] Scaffold `ports/neovim/lua/makinda/`
- [x] Generate `init.lua` with `setup({ variant = "light" | "dark" })`
- [x] Cover Treesitter highlight groups
- [x] Cover LSP semantic tokens
- [x] Cover diagnostics, gitsigns, telescope, nvim-tree/neo-tree, lualine
- [x] Generate Vim fallback `colors/makinda-light.vim` and `colors/makinda-dark.vim`
- [x] Cterm (256-color) fallback table
- [x] README install instructions for lazy.nvim / packer / vim-plug

## Phase 7 — Xcode

- [x] Scaffold `ports/xcode/`
- [x] Generate `Makinda Light.xccolortheme` (plist) from source
- [x] Generate Dark variant
- [x] Manual install script `install.sh`
- [x] README with screenshots in Xcode

## Phase 8 — Helix

- [x] Generate `ports/helix/makinda_light.toml`
- [x] Generate `ports/helix/makinda_dark.toml`
- [ ] Submit upstream PR to Helix's `runtime/themes/` directory

## Phase 9 — Terminals

- [x] iTerm2 — `ports/iterm2/Makinda Light.itermcolors`, `…Dark.itermcolors`
- [x] Warp — `ports/warp/makinda_light.yaml`, `…dark.yaml`
- [x] Alacritty — `ports/alacritty/makinda_light.toml`, `…dark.toml`
- [x] Kitty — `ports/kitty/makinda_light.conf`, `…dark.conf`
- [x] WezTerm — `ports/wezterm/makinda.lua`
- [x] Windows Terminal — JSON snippet in `ports/windows-terminal/`
- [x] Ghostty — theme file in `ports/ghostty/`

## Phase 10 — Backlog (Tier 3)

- [x] Emacs `makinda-theme.el` (`ports/emacs/`)
- [ ] Visual Studio (full) `.vssettings`
- [x] TextMate `.tmTheme` (`ports/textmate/`)
- [x] Notepad++ XML (`ports/notepad-plus-plus/`)
- [ ] Eclipse `.epf`
- [ ] BBEdit, Nova, Lapce
- [ ] Slack, Discord (BetterDiscord), Obsidian CSS

## Cross-cutting fixes

- [x] Add CI (GitHub Actions): lint JSON, run build, run contrast check (`.github/workflows/ci.yml`)
- [x] Add `scripts/contrast-check.mjs` — fails on AA violations for body text _(implemented as `build/contrast.mjs` + `npm run contrast:strict`)_
- [ ] Add screenshot generator (Playwright + a reference snippet) to keep marketing PNGs in sync
- [x] Single `release.mjs` that bumps version across every port and tags (`build/release.mjs`)

## Known issues to fix

Surfaced by `npm run contrast` (WCAG 2.1):

- [x] Light `syntax.comment` `#9ca3af` on `#ffffff` — was 2.54 : 1. **Fixed: now `#6b7280` → 4.83 : 1.**
- [x] Dark `syntax.comment` `#6b7280` on `#0e0e0f` — was 3.99 : 1. **Fixed: now `#7d8593` → 5.19 : 1.**

**Design decisions (advisory shortfalls, not blockers):**

- `syntax.function` (light) = brand orange `#f05106` on `#ffffff` lands at 3.57 : 1 against an AA target of 4.5. The orange is the project's brand identity and is used pervasively for function/tag/markup-heading accents. Treated as a **decorative accent** (AA-large 3.0). To fix outright would mean either darkening the brand or unifying function with keyword `#c73b07` — both change the visual identity.
- `button.foreground` (`#ffffff`) on `button.background` brand orange (`#ff6b0d` dark, `#f05106` light) lands at 2.85 / 3.57 : 1 against an AA target of 3.0. Same trade-off; the alternative is dark-text-on-orange buttons, which most users find less legible at small sizes.

These two are tracked as `advisory` in `build/contrast.mjs` so `npm run check` stays green while the audit still reports them.

Other:

- [ ] Light theme: orange on white can vibrate at small font sizes — consider a slightly darker brand variant for inline accents (`#d94405`?)
- [ ] Dark theme: terminal cursor color blends into selection on some terminals
- [x] Inconsistent comment color between Light and Dark — now Light `#6b7280` (subtle) / Dark `#7d8593` (subtle, lifted for contrast), both passing AA on their backgrounds. Intentional.

---

**Next up:** Phase 1 wrap (publish to Open VSX, marketplace migration, screenshots), then Phase 2+.
