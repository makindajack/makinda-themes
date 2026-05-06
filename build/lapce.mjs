#!/usr/bin/env node
/**
 * Generate Lapce themes (TOML) from source/palette.json.
 * Output:
 *   ports/lapce/makinda-light.toml
 *   ports/lapce/makinda-dark.toml
 *
 * Lapce theme reference: https://docs.lapce.dev/customize-theme
 * Drop into ~/.config/lapce-stable/themes/ then select via the theme picker.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function tomlEsc(s) {
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const themeName = `Makinda ${isDark ? "Dark" : "Light"}`;

    const colors = {
        red: c("state.error"),
        orange: c("brand.primary"),
        yellow: c("state.warning"),
        green: c("state.success"),
        cyan: c("syntax.markupLink"),
        blue: c("state.info"),
        purple: c("syntax.type"),
        magenta: c("syntax.namespace"),

        bg: c("bg.editor"),
        bg1: c("bg.elevated1"),
        bg2: c("bg.elevated2"),
        bg3: c("bg.elevated3"),
        fg: c("fg.default"),
        fg1: c("fg.secondary"),
        fg2: c("fg.muted"),
        fg3: c("fg.subtle"),
        border: c("border.default"),
        focus: c("border.focus"),
    };

    const ui = {
        "lapce.error": colors.red,
        "lapce.warn": colors.yellow,
        "lapce.dropdown_shadow": "#0000004d",
        "lapce.border": colors.border,
        "lapce.scroll_bar": c("border.strong"),
        "lapce.button.primary.background": colors.orange,
        "lapce.button.primary.foreground": c("fg.inverse"),
        "lapce.tab.active.background": c("bg.tabActive"),
        "lapce.tab.active.foreground": colors.fg,
        "lapce.tab.active.underline": colors.orange,
        "lapce.tab.inactive.background": colors.bg1,
        "lapce.tab.inactive.foreground": colors.fg2,
        "lapce.tab.separator": colors.border,
        "lapce.icon.active": colors.fg,
        "lapce.icon.inactive": colors.fg2,
        "lapce.remote.local": c("state.success"),
        "lapce.remote.connected": c("state.success"),
        "lapce.remote.connecting": c("state.warning"),
        "lapce.remote.disconnected": c("state.error"),
        "lapce.plugin.name": colors.fg,
        "lapce.plugin.description": colors.fg2,
        "lapce.plugin.author": colors.fg3,

        "editor.background": colors.bg,
        "editor.foreground": colors.fg,
        "editor.dim": colors.fg3,
        "editor.focus": colors.focus,
        "editor.caret": colors.orange,
        "editor.selection": colors.bg2,
        "editor.debug_break_line": colors.bg2,
        "editor.current_line": colors.bg1,
        "editor.link": c("syntax.markupLink"),
        "editor.visible_whitespace": c("fg.disabled"),
        "editor.indent_guide": c("border.subtle"),
        "editor.drag_drop_background": colors.bg2,
        "editor.drag_drop_tab_background": colors.bg2,
        "editor.sticky_header_background": colors.bg1,
        "editor.bracket": colors.orange,
        "editor.documentation.background": c("bg.menu"),

        "inlay_hint.foreground": colors.fg3,
        "inlay_hint.background": colors.bg1,
        "error_lens.error.foreground": colors.red,
        "error_lens.warning.foreground": colors.yellow,
        "error_lens.other.foreground": colors.fg2,
        "completion_lens.foreground": colors.fg3,

        "source_control.added": c("diff.addedFg"),
        "source_control.removed": c("diff.removedFg"),
        "source_control.modified": c("diff.changedFg"),

        "panel.background": c("bg.panel"),
        "panel.foreground": colors.fg,
        "panel.foreground.dim": colors.fg2,
        "panel.current.background": colors.bg1,
        "panel.current.foreground": colors.fg,
        "panel.current.foreground.dim": colors.fg2,
        "panel.hovered.background": colors.bg1,
        "panel.hovered.active.background": colors.bg2,
        "panel.hovered.foreground": colors.fg,
        "panel.hovered.foreground.dim": colors.fg2,
        "panel.section_header.background": colors.bg1,

        "status.background": colors.bg1,
        "status.foreground": colors.fg2,
        "status.modal.normal.background": colors.bg2,
        "status.modal.normal.foreground": colors.fg,
        "status.modal.insert.background": c("state.success"),
        "status.modal.insert.foreground": c("fg.inverse"),
        "status.modal.visual.background": colors.orange,
        "status.modal.visual.foreground": c("fg.inverse"),
        "status.modal.terminal.background": colors.purple,
        "status.modal.terminal.foreground": c("fg.inverse"),

        "palette.background": c("bg.menu"),
        "palette.foreground": colors.fg,
        "palette.current.background": colors.bg2,
        "palette.current.foreground": colors.fg,

        "completion.background": c("bg.menu"),
        "completion.current": colors.bg2,
        "hover.background": c("bg.menu"),

        "activity.background": c("bg.activitybar"),
        "activity.current": colors.orange,

        "debug.breakpoint": colors.red,
        "debug.breakpoint.hover": colors.orange,

        "panel.information.foreground": colors.fg,
        "terminal.cursor": colors.orange,
        "terminal.foreground": colors.fg,
        "terminal.background": colors.bg,
        "terminal.red": c("ansi.red"),
        "terminal.green": c("ansi.green"),
        "terminal.yellow": c("ansi.yellow"),
        "terminal.blue": c("ansi.blue"),
        "terminal.magenta": c("ansi.magenta"),
        "terminal.cyan": c("ansi.cyan"),
        "terminal.white": c("ansi.white"),
        "terminal.black": c("ansi.black"),
        "terminal.bright_red": c("ansi.brightRed"),
        "terminal.bright_green": c("ansi.brightGreen"),
        "terminal.bright_yellow": c("ansi.brightYellow"),
        "terminal.bright_blue": c("ansi.brightBlue"),
        "terminal.bright_magenta": c("ansi.brightMagenta"),
        "terminal.bright_cyan": c("ansi.brightCyan"),
        "terminal.bright_white": c("ansi.brightWhite"),
        "terminal.bright_black": c("ansi.brightBlack"),
    };

    const syntax = {
        "attribute.name": c("syntax.attribute"),
        "attribute.value": c("syntax.string"),
        "bracket.color.1": colors.orange,
        "bracket.color.2": colors.purple,
        "bracket.color.3": colors.cyan,
        builtinType: c("syntax.type"),
        comment: c("syntax.comment"),
        constant: c("syntax.constant"),
        constructor: c("syntax.function"),
        embedded: c("syntax.string"),
        enum: c("syntax.type"),
        enumMember: c("syntax.constant"),
        escape: c("syntax.stringEscape"),
        field: c("syntax.variable"),
        function: c("syntax.function"),
        "function.method": c("syntax.function"),
        interface: c("syntax.type"),
        keyword: c("syntax.keyword"),
        macro: c("syntax.decorator"),
        method: c("syntax.function"),
        namespace: c("syntax.namespace"),
        number: c("syntax.number"),
        operator: c("syntax.operator"),
        parameter: c("syntax.parameter"),
        property: c("syntax.variable"),
        punctuation: c("syntax.punctuation"),
        "punctuation.delimiter": c("syntax.punctuation"),
        regex: c("syntax.regex"),
        "selfKeyword": c("syntax.languageVariable"),
        string: c("syntax.string"),
        "string.escape": c("syntax.stringEscape"),
        "string.regexp": c("syntax.regex"),
        "string.special": c("syntax.stringEscape"),
        struct: c("syntax.type"),
        symbol: c("syntax.constant"),
        tag: c("syntax.tag"),
        type: c("syntax.type"),
        typeAlias: c("syntax.type"),
        typeParameter: c("syntax.type"),
        variable: c("syntax.variable"),
        "variable.builtin": c("syntax.languageVariable"),
        "variable.other.member": c("syntax.variable"),
        "markup.heading": c("syntax.markupHeading"),
        "markup.bold": c("syntax.markupHeading"),
        "markup.italic": c("syntax.keyword"),
        "markup.link": c("syntax.markupLink"),
        "markup.list": c("syntax.markupHeading"),
        "markup.raw": c("syntax.markupCode"),
        "markup.quote": c("syntax.markupQuote"),
    };

    const block = (header, obj) => {
        const lines = [`[${header}]`];
        for (const [k, v] of Object.entries(obj)) {
            const key = /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(k) ? k : tomlEsc(k);
            lines.push(`${key} = ${tomlEsc(v)}`);
        }
        return lines.join("\n");
    };

    const baseColors = {};
    for (const [k, v] of Object.entries(colors)) baseColors[k] = v;

    return [
        `# ${themeName} \u2014 Lapce theme. Generated from source/palette.json.`,
        ``,
        `[theme]`,
        `name = ${tomlEsc(themeName)}`,
        `author = "Jackson Makinda"`,
        `version = "1.0"`,
        `mode = ${tomlEsc(isDark ? "dark" : "light")}`,
        ``,
        block("color", baseColors),
        ``,
        block("ui", ui),
        ``,
        block("syntax", syntax),
        ``,
    ].join("\n");
}

console.log("Building Lapce themes\u2026");
for (const v of VARIANTS) {
    writeOut(`ports/lapce/makinda-${v}.toml`, build(v));
}
