#!/usr/bin/env node
/**
 * Generate a Nova theme extension from source/palette.json.
 * Output: ports/nova/Makinda.novaextension/Themes/{Makinda Light.json,Makinda Dark.json}
 * plus extension.json.
 *
 * Nova themes are JSON; install by opening the .novaextension folder in Nova
 * (Extensions → Extension Library → Install Local Extension).
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    return {
        name: `Makinda ${isDark ? "Dark" : "Light"}`,
        kind: isDark ? "dark" : "light",
        meta: {
            "interface-style": isDark ? "dark" : "light",
        },
        window: {
            background: c("bg.titlebar"),
            border: c("border.default"),
        },
        sidebar: {
            background: c("bg.sidebar"),
            "section-header-background": c("bg.elevated1"),
            "section-header-foreground": c("fg.muted"),
            border: c("border.default"),
            text: c("fg.default"),
            "selected-text": c("fg.default"),
            "selected-background": c("bg.elevated2"),
            "selected-text-inactive": c("fg.muted"),
            "selected-background-inactive": c("bg.elevated1"),
        },
        editor: {
            background: c("bg.editor"),
            border: c("border.default"),
            text: c("fg.default"),
            invisibles: c("fg.disabled"),
            "current-line": c("bg.elevated1"),
            cursor: c("brand.primary"),
            indentguide: c("border.subtle"),
            "indentguide-active": c("border.strong"),
            selection: c("bg.elevated2"),
            "selection-text": c("fg.default"),
            "selection-inactive": c("bg.elevated1"),
            "selection-text-inactive": c("fg.default"),
            gutter: {
                background: c("bg.editor"),
                text: c("fg.disabled"),
                "current-line-background": c("bg.elevated1"),
                "current-line-text": c("brand.primary"),
            },
        },
        styles: {
            comments: { color: c("syntax.comment"), italic: true },
            processing: { color: c("syntax.decorator") },
            declaration: { color: c("syntax.keyword") },
            bracket: { color: c("syntax.punctuation") },
            operator: { color: c("syntax.operator") },
            invalid: { color: c("state.error") },
            link: { color: c("syntax.markupLink"), underline: true },
            keywords: { color: c("syntax.keyword"), bold: true },
            "keywords-special": { color: c("syntax.keyword") },
            values: { color: c("syntax.constant") },
            "values-special": { color: c("syntax.constant") },
            identifiers: { color: c("fg.default") },
            "identifiers-type": { color: c("syntax.type") },
            "identifiers-function": { color: c("syntax.function") },
            "identifiers-method": { color: c("syntax.function") },
            "identifiers-constant": { color: c("syntax.constant") },
            "identifiers-variable": { color: c("syntax.variable") },
            "identifiers-property": { color: c("syntax.variable") },
            "identifiers-argument": { color: c("syntax.parameter"), italic: true },
            "identifiers-decorator": { color: c("syntax.decorator") },
            "identifiers-key": { color: c("syntax.attribute") },
            strings: { color: c("syntax.string") },
            "strings-special": { color: c("syntax.stringEscape") },
            regex: { color: c("syntax.regex") },
            "regex-special": { color: c("syntax.stringEscape") },
            numbers: { color: c("syntax.number") },
            "numbers-special": { color: c("syntax.constant") },
            tags: { color: c("syntax.tag") },
            "tags-attributes": { color: c("syntax.attribute") },
            "tags-values": { color: c("syntax.string") },
            "markup-headings": { color: c("syntax.markupHeading"), bold: true },
            "markup-bold": { color: c("syntax.markupHeading"), bold: true },
            "markup-italic": { color: c("syntax.keyword"), italic: true },
            "markup-link": { color: c("syntax.markupLink"), underline: true },
            "markup-list": { color: c("syntax.markupHeading") },
            "markup-code": { color: c("syntax.markupCode") },
            "markup-quote": { color: c("syntax.markupQuote"), italic: true },
        },
        terminal: {
            background: c("bg.editor"),
            text: c("fg.default"),
            cursor: c("brand.primary"),
            selection: c("bg.elevated2"),
            black: c("ansi.black"),
            red: c("ansi.red"),
            green: c("ansi.green"),
            yellow: c("ansi.yellow"),
            blue: c("ansi.blue"),
            magenta: c("ansi.magenta"),
            cyan: c("ansi.cyan"),
            white: c("ansi.white"),
            "bright-black": c("ansi.brightBlack"),
            "bright-red": c("ansi.brightRed"),
            "bright-green": c("ansi.brightGreen"),
            "bright-yellow": c("ansi.brightYellow"),
            "bright-blue": c("ansi.brightBlue"),
            "bright-magenta": c("ansi.brightMagenta"),
            "bright-cyan": c("ansi.brightCyan"),
            "bright-white": c("ansi.brightWhite"),
        },
    };
}

const extension = {
    identifier: "com.makindajack.makinda",
    name: "Makinda Themes",
    organization: "Jackson Makinda",
    description: "Premium Light + Dark themes with warm orange accents.",
    version: palette.version || "1.0.1",
    categories: ["themes"],
    main: null,
    themes: [
        { path: "Themes/Makinda Light.json" },
        { path: "Themes/Makinda Dark.json" },
    ],
};

console.log("Building Nova theme extension\u2026");
writeOut(
    "ports/nova/Makinda.novaextension/extension.json",
    JSON.stringify(extension, null, 2) + "\n",
);
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(
        `ports/nova/Makinda.novaextension/Themes/Makinda ${label}.json`,
        JSON.stringify(build(v), null, 2) + "\n",
    );
}
