#!/usr/bin/env node
/**
 * Helix theme port.
 *
 * Generates `ports/helix/makinda_<variant>.toml` from source/palette.json.
 *
 * Schema reference:
 *   https://docs.helix-editor.com/themes.html
 *
 * Helix themes use TOML with three sections:
 *   - top-level "scope" = "color" | { fg, bg, modifiers, underline }
 *   - [palette]   named colors
 *
 * Output:
 *   ports/helix/makinda_light.toml
 *   ports/helix/makinda_dark.toml
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function stripAlpha(hex) {
    return "#" + hex.replace("#", "").slice(0, 6).toLowerCase();
}

function tomlValue(v) {
    if (typeof v === "string") return `"${v}"`;
    if (Array.isArray(v)) return `[${v.map((x) => `"${x}"`).join(", ")}]`;
    const parts = [];
    if (v.fg) parts.push(`fg = "${v.fg}"`);
    if (v.bg) parts.push(`bg = "${v.bg}"`);
    if (v.underline) parts.push(`underline = { color = "${v.underline.color}", style = "${v.underline.style}" }`);
    if (v.modifiers) parts.push(`modifiers = [${v.modifiers.map((m) => `"${m}"`).join(", ")}]`);
    return `{ ${parts.join(", ")} }`;
}

function tomlKey(k) {
    return /^[A-Za-z0-9_-]+$/.test(k) ? k : `"${k}"`;
}

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";

    // Named palette aliases.
    const named = {
        bg: stripAlpha(c("bg.editor")),
        bg_sidebar: stripAlpha(c("bg.sidebar")),
        bg_elev1: stripAlpha(c("bg.elevated1")),
        bg_elev2: stripAlpha(c("bg.elevated2")),
        bg_elev3: stripAlpha(c("bg.elevated3")),
        bg_menu: stripAlpha(c("bg.menu")),
        fg: stripAlpha(c("fg.default")),
        fg_secondary: stripAlpha(c("fg.secondary")),
        fg_muted: stripAlpha(c("fg.muted")),
        fg_subtle: stripAlpha(c("fg.subtle")),
        fg_disabled: stripAlpha(c("fg.disabled")),
        fg_inverse: stripAlpha(c("fg.inverse")),
        border: stripAlpha(c("border.default")),
        border_strong: stripAlpha(c("border.strong")),
        primary: stripAlpha(c("brand.primary")),
        primary_hover: stripAlpha(c("brand.primaryHover")),
        accent: stripAlpha(c("brand.accent")),
        kw: stripAlpha(c("syntax.keyword")),
        fn: stripAlpha(c("syntax.function")),
        type: stripAlpha(c("syntax.type")),
        namespace: stripAlpha(c("syntax.namespace")),
        constant: stripAlpha(c("syntax.constant")),
        number: stripAlpha(c("syntax.number")),
        string: stripAlpha(c("syntax.string")),
        string_escape: stripAlpha(c("syntax.stringEscape")),
        regex: stripAlpha(c("syntax.regex")),
        comment: stripAlpha(c("syntax.comment")),
        variable: stripAlpha(c("syntax.variable")),
        parameter: stripAlpha(c("syntax.parameter")),
        language_variable: stripAlpha(c("syntax.languageVariable")),
        operator: stripAlpha(c("syntax.operator")),
        punctuation: stripAlpha(c("syntax.punctuation")),
        tag: stripAlpha(c("syntax.tag")),
        attribute: stripAlpha(c("syntax.attribute")),
        decorator: stripAlpha(c("syntax.decorator")),
        markup_heading: stripAlpha(c("syntax.markupHeading")),
        markup_link: stripAlpha(c("syntax.markupLink")),
        markup_code: stripAlpha(c("syntax.markupCode")),
        markup_quote: stripAlpha(c("syntax.markupQuote")),
        error: stripAlpha(c("state.error")),
        warning: stripAlpha(c("state.warning")),
        info: stripAlpha(c("state.info")),
        success: stripAlpha(c("state.success")),
        diff_added: stripAlpha(c("diff.addedFg")),
        diff_changed: stripAlpha(c("diff.changedFg")),
        diff_removed: stripAlpha(c("diff.removedFg")),
    };

    // Scope → style. Use palette aliases by name.
    const scopes = {
        // ---------- UI ----------
        "ui.background": { fg: "fg", bg: "bg" },
        "ui.background.separator": { fg: "border" },
        "ui.cursor": { fg: "bg", bg: "primary", modifiers: ["reversed"] },
        "ui.cursor.normal": { fg: "bg", bg: "primary" },
        "ui.cursor.insert": { fg: "bg", bg: "success" },
        "ui.cursor.select": { fg: "bg", bg: "constant" },
        "ui.cursor.match": { fg: "primary", modifiers: ["bold", "underlined"] },
        "ui.cursor.primary": { fg: "bg", bg: "primary" },
        "ui.cursorline.primary": { bg: "bg_elev1" },
        "ui.cursorline.secondary": { bg: "bg_elev1" },
        "ui.cursorcolumn.primary": { bg: "bg_elev1" },
        "ui.cursorcolumn.secondary": { bg: "bg_elev1" },
        "ui.linenr": { fg: "fg_disabled" },
        "ui.linenr.selected": { fg: "primary", modifiers: ["bold"] },
        "ui.statusline": { fg: "fg", bg: "bg" },
        "ui.statusline.inactive": { fg: "fg_muted", bg: "bg" },
        "ui.statusline.normal": { fg: "fg_inverse", bg: "primary", modifiers: ["bold"] },
        "ui.statusline.insert": { fg: "fg_inverse", bg: "success", modifiers: ["bold"] },
        "ui.statusline.select": { fg: "fg_inverse", bg: "constant", modifiers: ["bold"] },
        "ui.popup": { fg: "fg", bg: "bg_menu" },
        "ui.popup.info": { fg: "fg", bg: "bg_menu" },
        "ui.window": { fg: "border", bg: "bg" },
        "ui.help": { fg: "fg", bg: "bg_menu" },
        "ui.text": { fg: "fg" },
        "ui.text.focus": { fg: "fg", modifiers: ["bold"] },
        "ui.text.inactive": { fg: "fg_muted" },
        "ui.text.info": { fg: "info" },
        "ui.virtual": { fg: "fg_disabled" },
        "ui.virtual.ruler": { bg: "bg_elev1" },
        "ui.virtual.whitespace": { fg: "fg_disabled" },
        "ui.virtual.indent-guide": { fg: "border" },
        "ui.virtual.inlay-hint": { fg: "fg_disabled", bg: "bg" },
        "ui.virtual.inlay-hint.parameter": { fg: "fg_muted", bg: "bg" },
        "ui.virtual.inlay-hint.type": { fg: "fg_muted", bg: "bg" },
        "ui.virtual.wrap": { fg: "fg_disabled" },
        "ui.virtual.jump-label": { fg: "primary", modifiers: ["bold"] },
        "ui.menu": { fg: "fg", bg: "bg_menu" },
        "ui.menu.selected": { fg: "fg", bg: "bg_elev2", modifiers: ["bold"] },
        "ui.menu.scroll": { fg: "border_strong", bg: "bg_menu" },
        "ui.selection": { bg: "bg_elev2" },
        "ui.selection.primary": { bg: "bg_elev2" },
        "ui.highlight": { bg: "bg_elev1" },
        "ui.highlight.frameline": { bg: "bg_elev1" },
        "ui.bufferline": { fg: "fg_muted", bg: "bg_elev1" },
        "ui.bufferline.active": { fg: "fg", bg: "bg", modifiers: ["bold"] },
        "ui.bufferline.background": { bg: "bg" },
        "ui.gutter": { bg: "bg" },
        "ui.gutter.selected": { bg: "bg" },
        "ui.debug.breakpoint": { fg: "error" },
        "ui.debug.active": { fg: "primary" },

        // ---------- Diagnostics ----------
        warning: { fg: "warning" },
        error: { fg: "error" },
        info: { fg: "info" },
        hint: { fg: "fg_muted" },

        "diagnostic": { underline: { color: named.error.replace(/^#/, "") ? "error" : "error", style: "curl" } },
        "diagnostic.error": { underline: { color: "error", style: "curl" } },
        "diagnostic.warning": { underline: { color: "warning", style: "curl" } },
        "diagnostic.info": { underline: { color: "info", style: "curl" } },
        "diagnostic.hint": { underline: { color: "fg_muted", style: "curl" } },
        "diagnostic.unnecessary": { fg: "fg_disabled", modifiers: ["dim"] },
        "diagnostic.deprecated": { fg: "fg_disabled", modifiers: ["crossed_out"] },

        // ---------- Diff (gutter / overlay) ----------
        "diff.plus": { fg: "diff_added" },
        "diff.minus": { fg: "diff_removed" },
        "diff.delta": { fg: "diff_changed" },

        // ---------- Syntax ----------
        attribute: { fg: "decorator" },
        type: { fg: "type" },
        "type.builtin": { fg: "type" },
        "type.parameter": { fg: "type" },
        "type.enum.variant": { fg: "constant" },
        constructor: { fg: "type" },

        constant: { fg: "constant" },
        "constant.builtin": { fg: "constant" },
        "constant.builtin.boolean": { fg: "constant" },
        "constant.character": { fg: "string" },
        "constant.character.escape": { fg: "string_escape" },
        "constant.numeric": { fg: "number" },
        "constant.numeric.integer": { fg: "number" },
        "constant.numeric.float": { fg: "number" },

        string: { fg: "string" },
        "string.regexp": { fg: "regex" },
        "string.special": { fg: "string_escape" },
        "string.special.path": { fg: "markup_link" },
        "string.special.url": { fg: "markup_link", modifiers: ["underlined"] },
        "string.special.symbol": { fg: "string_escape" },

        comment: { fg: "comment", modifiers: ["italic"] },
        "comment.line": { fg: "comment", modifiers: ["italic"] },
        "comment.block": { fg: "comment", modifiers: ["italic"] },
        "comment.block.documentation": { fg: "comment", modifiers: ["italic"] },

        variable: { fg: "variable" },
        "variable.builtin": { fg: "language_variable", modifiers: ["italic"] },
        "variable.parameter": { fg: "parameter", modifiers: ["italic"] },
        "variable.other": { fg: "variable" },
        "variable.other.member": { fg: "variable" },

        label: { fg: "kw" },
        punctuation: { fg: "punctuation" },
        "punctuation.delimiter": { fg: "punctuation" },
        "punctuation.bracket": { fg: "punctuation" },
        "punctuation.special": { fg: "kw" },

        keyword: { fg: "kw" },
        "keyword.control": { fg: "kw" },
        "keyword.control.conditional": { fg: "kw" },
        "keyword.control.repeat": { fg: "kw" },
        "keyword.control.import": { fg: "kw" },
        "keyword.control.return": { fg: "kw" },
        "keyword.control.exception": { fg: "kw" },
        "keyword.operator": { fg: "operator" },
        "keyword.directive": { fg: "decorator" },
        "keyword.function": { fg: "kw" },
        "keyword.storage": { fg: "kw" },
        "keyword.storage.type": { fg: "kw" },
        "keyword.storage.modifier": { fg: "kw" },

        operator: { fg: "operator" },

        function: { fg: "fn" },
        "function.builtin": { fg: "fn" },
        "function.method": { fg: "fn" },
        "function.macro": { fg: "decorator" },
        "function.special": { fg: "decorator" },

        tag: { fg: "tag" },
        "tag.builtin": { fg: "tag" },

        namespace: { fg: "namespace" },

        "special": { fg: "string_escape" },

        // ---------- Markup ----------
        "markup.heading": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.heading.1": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.heading.2": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.heading.3": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.heading.4": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.heading.5": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.heading.6": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.heading.marker": { fg: "markup_heading" },
        "markup.list": { fg: "markup_heading" },
        "markup.list.numbered": { fg: "markup_heading" },
        "markup.list.unnumbered": { fg: "markup_heading" },
        "markup.list.checked": { fg: "success" },
        "markup.list.unchecked": { fg: "fg_muted" },
        "markup.bold": { fg: "markup_heading", modifiers: ["bold"] },
        "markup.italic": { fg: "kw", modifiers: ["italic"] },
        "markup.strikethrough": { modifiers: ["crossed_out"] },
        "markup.link": { fg: "markup_link" },
        "markup.link.url": { fg: "markup_link", modifiers: ["underlined"] },
        "markup.link.label": { fg: "markup_link" },
        "markup.link.text": { fg: "markup_link" },
        "markup.quote": { fg: "markup_quote", modifiers: ["italic"] },
        "markup.raw": { fg: "markup_code" },
        "markup.raw.inline": { fg: "markup_code" },
        "markup.raw.block": { fg: "markup_code" },
    };

    // Render TOML.
    const lines = [
        `# Makinda ${isDark ? "Dark" : "Light"} \u2014 Helix theme`,
        `# Generated from source/palette.json. Do not edit by hand.`,
        ``,
        `# inherits = "${isDark ? "default" : "default"}"`,
        ``,
    ];

    for (const [k, v] of Object.entries(scopes)) {
        lines.push(`${tomlKey(k)} = ${tomlValue(v)}`);
    }

    lines.push("", "[palette]");
    for (const [k, v] of Object.entries(named)) {
        lines.push(`${k} = "${v}"`);
    }
    lines.push("");

    return lines.join("\n");
}

console.log("Building Helix themes\u2026");
for (const v of VARIANTS) {
    writeOut(`ports/helix/makinda_${v}.toml`, build(v));
}
