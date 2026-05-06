# Theme Spec — Source of Truth

This document is the canonical color and token spec. Every editor port must derive from these tables. If a value is missing for a given token, fall back to the closest semantic role.

> Implementation note: the long-term plan is `source/palette.json` + `source/tokens.json` driving build scripts. Until that lands, this Markdown is the spec — keep it in sync with `themes/Makinda Light-color-theme.json` and `themes/Makinda Dark-color-theme.json`.

## Brand

| Token           | Light     | Dark      |
| --------------- | --------- | --------- |
| `brand.primary` | `#f05106` | `#ff6b0d` |
| `brand.hover`   | `#c73b07` | `#ff8d37` |
| `brand.muted`   | `#fbe1d2` | `#3a1c0a` |

## Base palette

### Backgrounds

| Token             | Light     | Dark      | Usage                             |
| ----------------- | --------- | --------- | --------------------------------- |
| `bg.editor`       | `#ffffff` | `#0e0e0f` | Editor canvas                     |
| `bg.sidebar`      | `#f9f9fa` | `#161618` | Sidebar, explorer                 |
| `bg.panel`        | `#f9f9fa` | `#161618` | Bottom panel (terminal, problems) |
| `bg.statusbar`    | `#f05106` | `#0e0e0f` | Status bar                        |
| `bg.titlebar`     | `#f9f9fa` | `#0e0e0f` | Title bar                         |
| `bg.activitybar`  | `#f9f9fa` | `#0e0e0f` | Activity bar                      |
| `bg.tab.active`   | `#ffffff` | `#0e0e0f` | Active tab                        |
| `bg.tab.inactive` | `#f0f0f1` | `#1a1a1c` | Inactive tab                      |
| `bg.line`         | `#fff7f2` | `#1a1a1c` | Current-line highlight            |
| `bg.selection`    | `#ffd5bc` | `#3a1c0a` | Selection                         |
| `bg.match`        | `#ffe4cc` | `#5a2a10` | Find match                        |

### Foregrounds

| Token        | Light     | Dark      | Usage                  |
| ------------ | --------- | --------- | ---------------------- |
| `fg.default` | `#1f2024` | `#e6e6e8` | Editor text            |
| `fg.muted`   | `#6b7280` | `#9ca3af` | Secondary UI text      |
| `fg.subtle`  | `#9ca3af` | `#6b7280` | Comments, placeholders |
| `fg.inverse` | `#ffffff` | `#0e0e0f` | Text on brand          |

### State

| Token     | Light     | Dark      |
| --------- | --------- | --------- |
| `error`   | `#dc2626` | `#f87171` |
| `warning` | `#d97706` | `#fbbf24` |
| `info`    | `#2563eb` | `#60a5fa` |
| `success` | `#059669` | `#34d399` |

### Borders & lines

| Token            | Light     | Dark      |
| ---------------- | --------- | --------- |
| `border.default` | `#e5e7eb` | `#27272a` |
| `border.focus`   | `#f05106` | `#ff6b0d` |
| `line.indent`    | `#e5e7eb` | `#27272a` |
| `line.guide`     | `#f05106` | `#ff6b0d` |

## Syntax tokens

| Semantic role           | Light     | Dark      | Examples                          |
| ----------------------- | --------- | --------- | --------------------------------- |
| `syntax.keyword`        | `#c73b07` | `#ff6b0d` | `if`, `return`, `import`, `class` |
| `syntax.function`       | `#f05106` | `#ff8d37` | function names, calls             |
| `syntax.method`         | `#f05106` | `#ff8d37` | method names                      |
| `syntax.type`           | `#7c3aed` | `#a78bfa` | classes, interfaces, type names   |
| `syntax.constant`       | `#7c3aed` | `#a78bfa` | `true`, `false`, `null`, numbers  |
| `syntax.number`         | `#7c3aed` | `#a78bfa` |                                   |
| `syntax.string`         | `#0d7377` | `#2dd4bf` | string literals                   |
| `syntax.string.escape`  | `#059669` | `#34d399` | `\n`, `\t`                        |
| `syntax.regex`          | `#0d7377` | `#2dd4bf` |                                   |
| `syntax.comment`        | `#9ca3af` | `#6b7280` |                                   |
| `syntax.comment.doc`    | `#6b7280` | `#9ca3af` |                                   |
| `syntax.variable`       | `#1f2024` | `#e6e6e8` | identifiers                       |
| `syntax.variable.param` | `#b45309` | `#fbbf24` | function parameters               |
| `syntax.property`       | `#1f2024` | `#e6e6e8` | object props                      |
| `syntax.operator`       | `#6b7280` | `#9ca3af` | `+`, `-`, `=>`                    |
| `syntax.punctuation`    | `#6b7280` | `#9ca3af` | `,`, `;`, brackets                |
| `syntax.tag`            | `#c73b07` | `#ff6b0d` | HTML/JSX tags                     |
| `syntax.attribute`      | `#7c3aed` | `#a78bfa` | HTML attrs                        |
| `syntax.namespace`      | `#7c3aed` | `#a78bfa` |                                   |
| `syntax.markup.heading` | `#c73b07` | `#ff6b0d` | Markdown `#`                      |
| `syntax.markup.bold`    | `#1f2024` | `#e6e6e8` |                                   |
| `syntax.markup.italic`  | `#1f2024` | `#e6e6e8` |                                   |
| `syntax.markup.link`    | `#2563eb` | `#60a5fa` |                                   |
| `syntax.markup.code`    | `#0d7377` | `#2dd4bf` |                                   |
| `syntax.deprecated`     | `#9ca3af` | `#6b7280` | strikethrough                     |

### Diff

| Token             | Light     | Dark      |
| ----------------- | --------- | --------- |
| `diff.added.bg`   | `#dcfce7` | `#0f3a24` |
| `diff.added.fg`   | `#059669` | `#34d399` |
| `diff.removed.bg` | `#fee2e2` | `#3a0f0f` |
| `diff.removed.fg` | `#dc2626` | `#f87171` |
| `diff.changed.bg` | `#fef3c7` | `#3a2a0f` |

## Terminal ANSI

The palette (`source/palette.json` → `variants.<variant>.ansi`) is the single source of truth. Keep this table in sync with it.

| Slot            | Light     | Dark      |
| --------------- | --------- | --------- |
| `black`         | `#36393f` | `#0e0e0f` |
| `red`           | `#dc2626` | `#f87171` |
| `green`         | `#16a34a` | `#34d399` |
| `yellow`        | `#d97706` | `#fbbf24` |
| `blue`          | `#2563eb` | `#60a5fa` |
| `magenta`       | `#7c3aed` | `#a78bfa` |
| `cyan`          | `#06b6d4` | `#2dd4bf` |
| `white`         | `#e5e7eb` | `#e6e6e8` |
| `brightBlack`   | `#6b7280` | `#6b7280` |
| `brightRed`     | `#f87171` | `#fca5a5` |
| `brightGreen`   | `#22c55e` | `#86efac` |
| `brightYellow`  | `#fbbf24` | `#fde68a` |
| `brightBlue`    | `#60a5fa` | `#93c5fd` |
| `brightMagenta` | `#a855f7` | `#c4b5fd` |
| `brightCyan`    | `#22d3ee` | `#67e8f9` |
| `brightWhite`   | `#ffffff` | `#ffffff` |

## Contrast targets

- Body text on background: **≥ 7.0 : 1** (AAA where possible).
- Comments on background: **≥ 4.5 : 1** (AA).
- Brand orange on `bg.editor`: **≥ 4.5 : 1** for non-decorative use; decorative accents may dip below.

## Editor-specific notes

- **JetBrains** has fewer color slots than VS Code — collapse `syntax.method` and `syntax.function` into one slot.
- **Sublime** uses scope selectors very similar to TextMate; the VS Code `tokenColors` array maps almost 1:1.
- **Xcode** lacks separate slots for `parameter` vs `variable` — use `fg.default`.
- **Terminals** only consume the ANSI table.
- **Vim cterm fallback** — map each color to its nearest 256-color index in the build script.
