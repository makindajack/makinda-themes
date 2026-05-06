# Supported Editors & IDEs

Status legend: ✅ shipping · 🟡 in progress · ⏳ planned · 💤 backlog

## Tier 1 — Code editors & IDEs

| Editor                   | Status | Format                         | Notes                                                                                                                |
| ------------------------ | :----: | ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **VS Code**              |   ✅   | `*.color-theme.json`           | Source port. Published as `makindajack.makinda-themes`.                                                              |
| **Cursor**               |   ✅   | (VS Code theme)                | Drop-in compatible — uses the VS Code extension as-is.                                                               |
| **Windsurf**             |   ✅   | (VS Code theme)                | Drop-in compatible.                                                                                                  |
| **VSCodium / Open VSX**  |   ✅   | `*.color-theme.json`           | Same `.vsix`; auto-published via release workflow.                                                                   |
| **JetBrains IDEs**       |   ✅   | `*.icls` + `*.theme.json`      | IntelliJ, WebStorm, PyCharm, GoLand, RustRover, Rider, RubyMine, PhpStorm, DataGrip, Android Studio, CLion, AppCode. |
| **Sublime Text**         |   ✅   | `*.sublime-color-scheme`       | JSON format; distribute via Package Control.                                                                         |
| **Zed**                  |   ✅   | `*.json` (Zed theme schema)    | Publish via Zed extensions registry.                                                                                 |
| **Neovim**               |   ✅   | Lua colorscheme + Vim fallback | Treesitter + LSP highlight groups; `.vim` fallback included.                                                         |
| **Xcode**                |   ✅   | `*.xccolortheme` (plist)       | Manual install into `~/Library/Developer/Xcode/UserData/FontAndColorThemes`.                                         |
| **Visual Studio (full)** |   ✅   | `*.vssettings`                 | Generated XML; import via Tools → Import and Export Settings.                                                        |
| **Helix**                |   ✅   | `*.toml`                       | Drop into `~/.config/helix/themes/`.                                                                                 |
| **Lapce**                |   ✅   | `*.toml`                       | Generated; install via Lapce settings.                                                                               |
| **Emacs**                |   ✅   | `makinda-*-theme.el`           | `deftheme`-based; load with `M-x load-theme`.                                                                        |
| **Nova** (Panic)         |   ✅   | `*.novaextension`              | macOS only.                                                                                                          |
| **TextMate**             |   ✅   | `*.tmTheme` (plist)            | Doubles as input for older Sublime/Atom.                                                                             |
| **BBEdit**               |   ✅   | `*.bbcolors` (plist)           | macOS only.                                                                                                          |
| **Notepad++**            |   ✅   | `*.xml` (UDL/styles)           | Windows only.                                                                                                        |
| **Eclipse**              |   ✅   | `*.epf`                        | Java-heavy audience; import via File → Import → Preferences.                                                         |
| **Fleet** (JetBrains)    |   💤   | JSON                           | Theme API not yet public.                                                                                            |
| **Atom / Pulsar**        |   💤   | `*.less`                       | Atom is EOL; consider Pulsar only.                                                                                   |
| **NetBeans**             |   💤   | `*.zip` font/colors profile    |                                                                                                                      |

## Tier 2 — Terminals

| Terminal             | Status | Format                  |
| -------------------- | :----: | ----------------------- |
| **iTerm2**           |   ✅   | `*.itermcolors`         |
| **Warp**             |   ✅   | `*.yaml`                |
| **Alacritty**        |   ✅   | `*.toml`                |
| **Kitty**            |   ✅   | `*.conf`                |
| **WezTerm**          |   ✅   | Lua                     |
| **Windows Terminal** |   ✅   | `settings.json` snippet |
| **Ghostty**          |   ✅   | theme file              |
| **Hyper**            |   💤   | `*.js` plugin           |
| **macOS Terminal**   |   💤   | `*.terminal` (plist)    |
| **GNOME Terminal**   |   💤   | dconf profile           |
| **Konsole**          |   💤   | `*.colorscheme`         |
| **Tabby**            |   💤   | `*.yaml`                |

## Tier 3 — Web & misc

| Target                                       | Status | Format                     |
| -------------------------------------------- | :----: | -------------------------- |
| **Slack**                                    |   ✅   | sidebar color string       |
| **Discord** (BetterDiscord)                  |   ✅   | CSS                        |
| **Obsidian**                                 |   ✅   | `*.css`                    |
| **GitHub web** (refined-github / userstyles) |   💤   | CSS                        |
| **Logseq**                                   |   💤   | `*.css`                    |
| **Highlight.js / Prism**                     |   💤   | CSS                        |
| **Shiki / Starry-Night**                     |   💤   | JSON (TextMate-compatible) |

## Format references

- **VS Code**: <https://code.visualstudio.com/api/extension-guides/color-theme>
- **JetBrains**: <https://plugins.jetbrains.com/docs/intellij/themes-getting-started.html>
- **Sublime**: <https://www.sublimetext.com/docs/color_schemes.html>
- **Zed**: <https://zed.dev/docs/extensions/themes>
- **Xcode**: plist format, no public schema — reverse-engineered from existing themes.
- **Helix**: <https://docs.helix-editor.com/themes.html>
- **iTerm2**: <https://iterm2.com/documentation-preferences-profiles-colors.html>
- **Alacritty**: <https://alacritty.org/config-alacritty.html>
- **Kitty**: <https://sw.kovidgoyal.net/kitty/conf/#color-scheme>
