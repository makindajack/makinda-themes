#!/usr/bin/env node
/**
 * Zed theme port.
 *
 * Generates one combined theme family JSON containing both Light and Dark
 * variants, plus a minimal `extension.toml` so the directory can be loaded
 * via Zed → Extensions → Install Dev Extension.
 *
 * Schema:
 *   https://zed.dev/docs/extensions/themes
 *   https://zed.dev/schema/themes/v0.2.0.json
 *
 * Output:
 *   ports/zed/extension.toml
 *   ports/zed/themes/makinda.json
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

/** Convert "#rrggbbaa" or "#rrggbb" → "#RRGGBBAA" (Zed expects 8-digit hex). */
function hex8(input) {
    let h = input.replace("#", "").toUpperCase();
    if (h.length === 6) h += "FF";
    if (h.length === 3) {
        h = h.split("").map((ch) => ch + ch).join("") + "FF";
    }
    return `#${h}`;
}

function syntaxEntry(color, opts = {}) {
    const e = { color: hex8(color) };
    if (opts.italic) e.font_style = "italic";
    if (opts.bold) e.font_weight = 700;
    return e;
}

function buildVariant(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;

    const success = c("state.success");
    const warning = c("state.warning");
    const error = c("state.error");
    const info = c("state.info");

    return {
        name: label,
        appearance: isDark ? "dark" : "light",
        style: {
            // ---------- Workspace chrome ----------
            background: hex8(c("bg.editor")),
            "editor.background": hex8(c("bg.editor")),
            "editor.foreground": hex8(c("fg.default")),
            "editor.gutter.background": hex8(c("bg.editor")),
            "editor.line_number": hex8(c("fg.disabled")),
            "editor.active_line_number": hex8(c("brand.primary")),
            "editor.active_line.background": hex8(c("bg.elevated1")),
            "editor.highlighted_line.background": hex8(c("bg.elevated1")),
            "editor.subheader.background": hex8(c("bg.elevated1")),
            "editor.document_highlight.read_background": hex8(c("bg.elevated2")),
            "editor.document_highlight.write_background": hex8(c("bg.elevated2")),
            "editor.document_highlight.bracket_background": hex8(c("bg.elevated2")),
            "editor.invisible": hex8(c("fg.disabled")),

            "elevated_surface.background": hex8(c("bg.menu")),
            "surface.background": hex8(c("bg.editor")),
            "panel.background": hex8(c("bg.panel")),
            "panel.focused_border": hex8(c("brand.primary")),
            "pane.focused_border": hex8(c("brand.primary")),
            "tab_bar.background": hex8(c("bg.editor")),
            "tab.active_background": hex8(c("bg.tabActive")),
            "tab.inactive_background": hex8(c("bg.elevated1")),
            "title_bar.background": hex8(c("bg.titlebar")),
            "title_bar.inactive_background": hex8(c("bg.titlebar")),
            "toolbar.background": hex8(c("bg.editor")),
            "status_bar.background": hex8(c("bg.editor")),

            border: hex8(c("border.default")),
            "border.variant": hex8(c("border.subtle")),
            "border.focused": hex8(c("border.focus")),
            "border.selected": hex8(c("brand.primary")),
            "border.transparent": "#00000000",
            "border.disabled": hex8(c("border.subtle")),

            text: hex8(c("fg.default")),
            "text.muted": hex8(c("fg.muted")),
            "text.placeholder": hex8(c("fg.subtle")),
            "text.disabled": hex8(c("fg.disabled")),
            "text.accent": hex8(c("brand.primary")),

            icon: hex8(c("fg.default")),
            "icon.muted": hex8(c("fg.muted")),
            "icon.disabled": hex8(c("fg.disabled")),
            "icon.placeholder": hex8(c("fg.subtle")),
            "icon.accent": hex8(c("brand.primary")),

            // ---------- Controls ----------
            "element.background": hex8(c("bg.editor")),
            "element.hover": hex8(c("bg.elevated1")),
            "element.active": hex8(c("bg.elevated2")),
            "element.selected": hex8(c("bg.elevated2")),
            "element.disabled": hex8(c("bg.elevated1")),

            "ghost_element.background": "#00000000",
            "ghost_element.hover": hex8(c("bg.elevated1")),
            "ghost_element.active": hex8(c("bg.elevated2")),
            "ghost_element.selected": hex8(c("bg.elevated2")),
            "ghost_element.disabled": hex8(c("bg.elevated1")),

            "drop_target.background": hex8(c("bg.elevated2")),

            // ---------- Search / selection ----------
            "search.match_background": hex8(c("brand.selectionAlpha")),
            "selection.background": hex8(c("brand.selectionAlpha")),

            // ---------- Scrollbars ----------
            "scrollbar.thumb.background": hex8(c("border.strong")),
            "scrollbar.thumb.hover_background": hex8(c("fg.subtle")),
            "scrollbar.thumb.border": "#00000000",
            "scrollbar.track.background": hex8(c("bg.editor")),
            "scrollbar.track.border": hex8(c("border.subtle")),

            // ---------- Cursor ----------
            "players": [
                {
                    cursor: hex8(c("brand.primary")),
                    background: hex8(c("brand.primary")),
                    selection: hex8(c("brand.selectionAlpha")),
                },
            ],

            // ---------- Status surfaces ----------
            error: hex8(error),
            "error.background": hex8(c("bg.editor")),
            "error.border": hex8(error),
            warning: hex8(warning),
            "warning.background": hex8(c("bg.editor")),
            "warning.border": hex8(warning),
            info: hex8(info),
            "info.background": hex8(c("bg.editor")),
            "info.border": hex8(info),
            success: hex8(success),
            "success.background": hex8(c("bg.editor")),
            "success.border": hex8(success),
            hint: hex8(c("fg.muted")),
            "hint.background": hex8(c("bg.editor")),
            "hint.border": hex8(c("fg.muted")),
            predictive: hex8(c("fg.subtle")),
            "predictive.background": hex8(c("bg.editor")),
            "predictive.border": hex8(c("fg.subtle")),
            unreachable: hex8(c("fg.disabled")),
            "unreachable.background": hex8(c("bg.editor")),
            "unreachable.border": hex8(c("fg.disabled")),

            // ---------- Conflict / created / deleted / hidden / ignored / modified / renamed ----------
            conflict: hex8(c("diff.changedFg")),
            "conflict.background": hex8(c("bg.editor")),
            "conflict.border": hex8(c("diff.changedFg")),
            created: hex8(c("diff.addedFg")),
            "created.background": hex8(c("bg.editor")),
            "created.border": hex8(c("diff.addedFg")),
            deleted: hex8(c("diff.removedFg")),
            "deleted.background": hex8(c("bg.editor")),
            "deleted.border": hex8(c("diff.removedFg")),
            modified: hex8(c("diff.changedFg")),
            "modified.background": hex8(c("bg.editor")),
            "modified.border": hex8(c("diff.changedFg")),
            renamed: hex8(info),
            "renamed.background": hex8(c("bg.editor")),
            "renamed.border": hex8(info),
            hidden: hex8(c("fg.disabled")),
            "hidden.background": hex8(c("bg.editor")),
            "hidden.border": hex8(c("fg.disabled")),
            ignored: hex8(c("fg.disabled")),
            "ignored.background": hex8(c("bg.editor")),
            "ignored.border": hex8(c("fg.disabled")),

            // ---------- Terminal ----------
            "terminal.background": hex8(c("bg.editor")),
            "terminal.foreground": hex8(c("fg.default")),
            "terminal.bright_foreground": hex8(c("fg.default")),
            "terminal.dim_foreground": hex8(c("fg.muted")),
            "terminal.ansi.black": hex8(c("ansi.black")),
            "terminal.ansi.bright_black": hex8(c("ansi.brightBlack")),
            "terminal.ansi.dim_black": hex8(c("ansi.black")),
            "terminal.ansi.red": hex8(c("ansi.red")),
            "terminal.ansi.bright_red": hex8(c("ansi.brightRed")),
            "terminal.ansi.dim_red": hex8(c("ansi.red")),
            "terminal.ansi.green": hex8(c("ansi.green")),
            "terminal.ansi.bright_green": hex8(c("ansi.brightGreen")),
            "terminal.ansi.dim_green": hex8(c("ansi.green")),
            "terminal.ansi.yellow": hex8(c("ansi.yellow")),
            "terminal.ansi.bright_yellow": hex8(c("ansi.brightYellow")),
            "terminal.ansi.dim_yellow": hex8(c("ansi.yellow")),
            "terminal.ansi.blue": hex8(c("ansi.blue")),
            "terminal.ansi.bright_blue": hex8(c("ansi.brightBlue")),
            "terminal.ansi.dim_blue": hex8(c("ansi.blue")),
            "terminal.ansi.magenta": hex8(c("ansi.magenta")),
            "terminal.ansi.bright_magenta": hex8(c("ansi.brightMagenta")),
            "terminal.ansi.dim_magenta": hex8(c("ansi.magenta")),
            "terminal.ansi.cyan": hex8(c("ansi.cyan")),
            "terminal.ansi.bright_cyan": hex8(c("ansi.brightCyan")),
            "terminal.ansi.dim_cyan": hex8(c("ansi.cyan")),
            "terminal.ansi.white": hex8(c("ansi.white")),
            "terminal.ansi.bright_white": hex8(c("ansi.brightWhite")),
            "terminal.ansi.dim_white": hex8(c("ansi.white")),

            // ---------- Syntax ----------
            syntax: {
                attribute: syntaxEntry(c("syntax.attribute")),
                boolean: syntaxEntry(c("syntax.constant")),
                comment: syntaxEntry(c("syntax.comment"), { italic: true }),
                "comment.doc": syntaxEntry(c("syntax.comment"), { italic: true }),
                constant: syntaxEntry(c("syntax.constant")),
                constructor: syntaxEntry(c("syntax.type")),
                embedded: syntaxEntry(c("syntax.keyword")),
                emphasis: syntaxEntry(c("syntax.keyword"), { italic: true }),
                "emphasis.strong": syntaxEntry(c("syntax.markupHeading"), { bold: true }),
                enum: syntaxEntry(c("syntax.type")),
                function: syntaxEntry(c("syntax.function")),
                "function.builtin": syntaxEntry(c("syntax.function")),
                "function.method": syntaxEntry(c("syntax.function")),
                hint: syntaxEntry(c("fg.muted")),
                keyword: syntaxEntry(c("syntax.keyword")),
                label: syntaxEntry(c("syntax.namespace")),
                link_text: syntaxEntry(c("syntax.markupLink")),
                link_uri: syntaxEntry(c("syntax.markupLink")),
                namespace: syntaxEntry(c("syntax.namespace")),
                number: syntaxEntry(c("syntax.number")),
                operator: syntaxEntry(c("syntax.operator")),
                preproc: syntaxEntry(c("syntax.decorator")),
                primary: syntaxEntry(c("fg.default")),
                property: syntaxEntry(c("syntax.variable")),
                punctuation: syntaxEntry(c("syntax.punctuation")),
                "punctuation.bracket": syntaxEntry(c("syntax.punctuation")),
                "punctuation.delimiter": syntaxEntry(c("syntax.punctuation")),
                "punctuation.list_marker": syntaxEntry(c("syntax.markupHeading")),
                "punctuation.special": syntaxEntry(c("syntax.keyword")),
                string: syntaxEntry(c("syntax.string")),
                "string.escape": syntaxEntry(c("syntax.stringEscape")),
                "string.regex": syntaxEntry(c("syntax.regex")),
                "string.special": syntaxEntry(c("syntax.stringEscape")),
                "string.special.symbol": syntaxEntry(c("syntax.stringEscape")),
                tag: syntaxEntry(c("syntax.tag")),
                "text.literal": syntaxEntry(c("syntax.markupCode")),
                title: syntaxEntry(c("syntax.markupHeading"), { bold: true }),
                type: syntaxEntry(c("syntax.type")),
                "type.builtin": syntaxEntry(c("syntax.type")),
                variable: syntaxEntry(c("syntax.variable")),
                "variable.parameter": syntaxEntry(c("syntax.parameter"), { italic: true }),
                "variable.special": syntaxEntry(c("syntax.languageVariable"), { italic: true }),
                variant: syntaxEntry(c("syntax.constant")),
            },
        },
    };
}

function buildFamily() {
    return {
        $schema: "https://zed.dev/schema/themes/v0.2.0.json",
        name: "Makinda Themes",
        author: "Jackson Makinda",
        themes: VARIANTS.map(buildVariant),
    };
}

function buildExtensionToml() {
    // Minimal Zed extension manifest. `id` matches the directory; `themes`
    // is auto-discovered from the themes/ folder but we declare it for clarity.
    return `id = "makinda-themes"
name = "Makinda Themes"
description = "Premium light and dark themes for Zed with warm orange accents and excellent readability."
version = "1.0.0"
schema_version = 1
authors = ["Jackson Makinda <jacksonmakinda@outlook.com>"]
repository = "https://github.com/makindajack/makinda-themes"
`;
}

console.log("Building Zed theme\u2026");
writeOut("ports/zed/extension.toml", buildExtensionToml());
writeOut("ports/zed/themes/makinda.json", JSON.stringify(buildFamily(), null, 2) + "\n");
