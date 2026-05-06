# Theme Spec — Source of Truth

This document is the canonical color and token spec. Every editor port must derive from these tables. If a value is missing for a given token, fall back to the closest semantic role.

> Implementation note: the long-term plan is `source/palette.json` + `source/tokens.json` driving build scripts. Until that lands, this Markdown is the spec — keep it in sync with `themes/Makinda Light-color-theme.json` and `themes/Makinda Dark-color-theme.json`.

## Brand

| Token           | Light     | Dark      |
| --------------- | --------- | --------- |
| `brand.primary` | `#e65800` | `#ff711a` |
| `brand.hover`   | `#b34400` | `#ff9452` |
| `brand.muted`   | `#fbe1d2` | `#3a1c0a` |

## Base palette

### Backgrounds

| Token             | Light     | Dark      | Usage                             |
| ----------------- | --------- | --------- | --------------------------------- |
| `bg.editor`       | `#ffffff` | `#0e0e0f` | Editor canvas                     |
| `bg.sidebar`      | `#fafafa` | `#18181b` | Sidebar, explorer                 |
| `bg.panel`        | `#fafafa` | `#18181b` | Bottom panel (terminal, problems) |
| `bg.statusbar`    | `#e65800` | `#0e0e0f` | Status bar                        |
| `bg.titlebar`     | `#fafafa` | `#0e0e0f` | Title bar                         |
| `bg.activitybar`  | `#fafafa` | `#0e0e0f` | Activity bar                      |
| `bg.tab.active`   | `#ffffff` | `#0e0e0f` | Active tab                        |
| `bg.tab.inactive` | `#f0f0f1` | `#1a1a1c` | Inactive tab                      |
| `bg.line`         | `#fff7f2` | `#1a1a1c` | Current-line highlight            |
| `bg.selection`    | `#ffd5bc` | `#3a1c0a` | Selection                         |
| `bg.match`        | `#ffe4cc` | `#5a2a10` | Find match                        |

### Foregrounds

| Token        | Light     | Dark      | Usage                  |
| ------------ | --------- | --------- | ---------------------- |
| `fg.default` | `#1f2024` | `#e6e6e8` | Editor text            |
| `fg.muted`   | `#71717a` | `#a1a1aa` | Secondary UI text      |
| `fg.subtle`  | `#a1a1aa` | `#71717a` | Comments, placeholders |
| `fg.inverse` | `#ffffff` | `#0e0e0f` | Text on brand          |

### State

| Token     | Light     | Dark      |
| --------- | --------- | --------- |
| `error`   | `#e11d48` | `#fb7185` |
| `warning` | `#d97706` | `#fbbf24` |
| `info`    | `#2563eb` | `#60a5fa` |
| `success` | `#059669` | `#34d399` |

### Borders & lines

| Token            | Light     | Dark      |
| ---------------- | --------- | --------- |
| `border.default` | `#e5e7eb` | `#27272a` |
| `border.focus`   | `#e65800` | `#ff711a` |
| `line.indent`    | `#e5e7eb` | `#27272a` |
| `line.guide`     | `#e65800` | `#ff711a` |

## Syntax tokens

| Semantic role           | Light     | Dark      | Examples                          |
| ----------------------- | --------- | --------- | --------------------------------- |
| `syntax.keyword`        | `#b34400` | `#ff711a` | `if`, `return`, `import`, `class` |
| `syntax.function`       | `#e65800` | `#ff9452` | function names, calls             |
| `syntax.method`         | `#e65800` | `#ff9452` | method names                      |
| `syntax.type`           | `#6b26c0` | `#a26ee2` | classes, interfaces, type names   |
| `syntax.constant`       | `#6b26c0` | `#a26ee2` | `true`, `false`, `null`, numbers  |
| `syntax.number`         | `#6b26c0` | `#a26ee2` |                                   |
| `syntax.string`         | `#0d7377` | `#2dd4bf` | string literals                   |
| `syntax.string.escape`  | `#059669` | `#34d399` | `\n`, `\t`                        |
| `syntax.regex`          | `#0d7377` | `#2dd4bf` |                                   |
| `syntax.comment`        | `#a1a1aa` | `#71717a` |                                   |
| `syntax.comment.doc`    | `#71717a` | `#a1a1aa` |                                   |
| `syntax.variable`       | `#1f2024` | `#e6e6e8` | identifiers                       |
| `syntax.variable.param` | `#b45309` | `#fbbf24` | function parameters               |
| `syntax.property`       | `#1f2024` | `#e6e6e8` | object props                      |
| `syntax.operator`       | `#71717a` | `#a1a1aa` | `+`, `-`, `=>`                    |
| `syntax.punctuation`    | `#71717a` | `#a1a1aa` | `,`, `;`, brackets                |
| `syntax.tag`            | `#b34400` | `#ff711a` | HTML/JSX tags                     |
| `syntax.attribute`      | `#6b26c0` | `#a26ee2` | HTML attrs                        |
| `syntax.namespace`      | `#6b26c0` | `#a26ee2` |                                   |
| `syntax.markup.heading` | `#b34400` | `#ff711a` | Markdown `#`                      |
| `syntax.markup.bold`    | `#1f2024` | `#e6e6e8` |                                   |
| `syntax.markup.italic`  | `#1f2024` | `#e6e6e8` |                                   |
| `syntax.markup.link`    | `#2563eb` | `#60a5fa` |                                   |
| `syntax.markup.code`    | `#0d7377` | `#2dd4bf` |                                   |
| `syntax.deprecated`     | `#a1a1aa` | `#71717a` | strikethrough                     |

### Diff

| Token             | Light     | Dark      |
| ----------------- | --------- | --------- |
| `diff.added.bg`   | `#dcfce7` | `#0f3a24` |
| `diff.added.fg`   | `#059669` | `#34d399` |
| `diff.removed.bg` | `#fee2e2` | `#3a0f0f` |
| `diff.removed.fg` | `#e11d48` | `#fb7185` |
| `diff.changed.bg` | `#fef3c7` | `#3a2a0f` |

## Terminal ANSI

The palette (`source/palette.json` → `variants.<variant>.ansi`) is the single source of truth. Keep this table in sync with it.

| Slot            | Light     | Dark      |
| --------------- | --------- | --------- |
| `black`         | `#52525b` | `#0e0e0f` |
| `red`           | `#e11d48` | `#fb7185` |
| `green`         | `#059669` | `#34d399` |
| `yellow`        | `#d97706` | `#fbbf24` |
| `blue`          | `#2563eb` | `#60a5fa` |
| `magenta`       | `#6b26c0` | `#a26ee2` |
| `cyan`          | `#06b6d4` | `#2dd4bf` |
| `white`         | `#e5e7eb` | `#e6e6e8` |
| `brightBlack`   | `#71717a` | `#71717a` |
| `brightRed`     | `#fb7185` | `#fca5a5` |
| `brightGreen`   | `#10b981` | `#86efac` |
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
