# Changelog

All notable changes to the "Makinda Themes" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-05-06

### Added

- Per-language preview screenshots (TypeScript, Go, Rust, Python, JSON, HTML, Markdown) for both Light and Dark, generated via Playwright + Shiki (`npm run screenshots`).
- Multi-IDE release automation (`build/release.mjs`) that packages every editor port for distribution.
- GitHub Actions workflow (`.github/workflows/release.yml`) that builds and attaches release artifacts on tag push.
- Initial publishing flows for non-VS Code marketplaces (JetBrains, Sublime Package Control, Obsidian, Zed, BetterDiscord, Nova).

### Changed

- README rewritten with refreshed previews and a clearer multi-IDE install matrix.
- `docs/IDES.md`, `docs/INSTALLATION.md`, and `docs/SCOPE.md` reorganised to reflect the current port roster.

## [1.0.2] - 2026-05-06

### Changed

- **Comment colors lifted for WCAG AA compliance.** Light comments `#9ca3af` → `#6b7280` (4.83 : 1 against the editor background, was 2.54). Dark comments `#6b7280` → `#7d8593` (5.19 : 1, was 3.99).
- Reconciled the terminal ANSI table across the palette, theme JSONs, and `docs/THEMES.md` so every editor and terminal port draws from a single source of truth.

### Added

- TypeScript / JavaScript decorator semantic-token coverage (`meta.decorator.*`, `punctuation.decorator`).
- Go receiver-type semantic-token coverage (`variable.parameter.receiver.go`, etc.).
- Source-of-truth pipeline under `source/` + `build/`: palette, tokens, validator, contrast audit, and per-editor port generators (Alacritty, Kitty, Warp, Windows Terminal, iTerm2, plus a VS Code regenerator).
- `npm run check` (validate + contrast) wired into `vscode:prepublish`.

### Documentation

- Documented OS-appearance auto-switching via `window.autoDetectColorScheme` in the README.
- Phase 1 of the multi-IDE roadmap completed (see `docs/TODO.md`).

## [1.0.1] - 2026-05-06

### Changed

- **Combined Light + Dark into a single extension** ("Makinda Themes"). Users now get both variants in one install.
- Renamed extension from `makinda-light` to `makinda-themes`.
- Updated Marketplace gallery banner to dark for better visibility.

### Added

- Bundled Makinda Dark theme (previously published as the standalone `makindajack.makinda-dark` extension, now deprecated).

### Migration

- If you previously installed `makindajack.makinda-dark`, you can uninstall it — both themes are now provided by `makindajack.makinda-themes`.

## [1.0.0] - 2026-03-27 (Makinda Light)

### Added

- Complete theme overhaul with professionally curated colors
- Comprehensive syntax highlighting for all major languages
- Semantic token colors for enhanced code intelligence
- Status bar color indicators for errors, warnings, and debugging
- Full UI theming including tabs, panels, sidebar, and activity bar
- Problem panel icons with color-coded severity
- Documentation folder with installation, contributing, and publishing guides

### Changed

- **Editor Background** — Clean white (#ffffff) for optimal readability
- **Sidebar Background** — Subtle gray (#f9f9fa) for visual separation
- **Brand Orange Accents** — #f05106 for active elements and key UI
- **Syntax Colors**
  - Strings: Teal (#0d7377) for excellent contrast
  - Types/Classes: Purple (#7c3aed) for clear distinction
  - Functions: Orange (#f05106) brand accent
  - Keywords: Deep orange (#c73b07) for emphasis
  - Comments: Muted gray (#9ca3af) to reduce distraction

### Fixed

- Tab styling with orange accent for active tab
- Breadcrumb colors for better navigation visibility
- Border colors for subtle UI definition
- Selection and highlight colors for better visibility
- Git decoration colors for file status clarity

## [0.2.3] - Previous Release

### Added

- Various UI improvements and bug fixes

## [0.2.0] - Early Development

### Added

- Updated color scheme

## [0.1.0] - Initial Release

### Added

- Initial release of Makinda Light theme

---

[1.0.0]: https://github.com/makindajack/makinda-themes/releases/tag/v1.0.0
[0.2.3]: https://github.com/makindajack/makinda-themes/releases/tag/v0.2.3
[0.2.0]: https://github.com/makindajack/makinda-themes/releases/tag/v0.2.0
[0.1.0]: https://github.com/makindajack/makinda-themes/releases/tag/v0.1.0

---

## Makinda Dark — historical changelog

Below is the changelog of the previously separate `makindajack.makinda-dark` extension, preserved here for reference.

### [1.0.0] - 2026-03-27 (Makinda Dark)

#### Added

- Complete dark theme overhaul with professionally curated colors
- 140+ token color scopes for comprehensive syntax highlighting
- 200+ UI color definitions for full editor coverage
- Semantic token colors support
- Brand color integration (Orange, Purple, Teal palette)
- Italic styling for comments, parameters, and keywords

#### Changed

- Background to deeper black (#0e0e0f) for better contrast
- Function highlighting with vibrant orange (#ff8d37)
- Type/class colors with purple tones (#a78bfa)
- String colors with teal (#2dd4bf)
- Comment visibility with gray italic (#6b7280)

#### Fixed

- Color contrast issues in various UI elements
- Terminal ANSI colors for better readability
- Git decoration colors for better visibility

### [0.2.6] - Previous Release (Makinda Dark)

### [0.2.0] - Early Development (Makinda Dark)
