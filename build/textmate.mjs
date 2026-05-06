#!/usr/bin/env node
/**
 * Generate TextMate `.tmTheme` files (XML plist) from source/palette.json.
 * Output:
 *   ports/textmate/Makinda Light.tmTheme
 *   ports/textmate/Makinda Dark.tmTheme
 *
 * Schema: https://macromates.com/manual/en/themes
 * Notes: TextMate uses `#RRGGBB` and a single dictionary per scope rule.
 * The `settings` array begins with a global rule (no `scope`) carrying the
 * editor surface colors, followed by one rule per syntax scope.
 */

import { randomUUID } from "node:crypto";
import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();
const stripAlpha = (h) => "#" + h.replace("#", "").slice(0, 6).toUpperCase();

function xmlEsc(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function dict(entries) {
    const lines = ["<dict>"];
    for (const [k, v] of entries) {
        lines.push(`    <key>${xmlEsc(k)}</key>`);
        lines.push(`    <string>${xmlEsc(v)}</string>`);
    }
    lines.push("</dict>");
    return lines.join("\n");
}

function rule(name, scope, settings) {
    const entries = [["name", name]];
    if (scope) entries.push(["scope", scope]);
    const inner = ["<dict>"];
    for (const [k, v] of entries) inner.push(`        <key>${xmlEsc(k)}</key>`, `        <string>${xmlEsc(v)}</string>`);
    inner.push("        <key>settings</key>", "        <dict>");
    for (const [k, v] of Object.entries(settings)) {
        inner.push(`            <key>${xmlEsc(k)}</key>`, `            <string>${xmlEsc(v)}</string>`);
    }
    inner.push("        </dict>", "    </dict>");
    return inner.join("\n");
}

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;

    const globals = {
        background: stripAlpha(c("bg.editor")),
        foreground: stripAlpha(c("fg.default")),
        caret: stripAlpha(c("brand.primary")),
        invisibles: stripAlpha(c("fg.disabled")),
        lineHighlight: stripAlpha(c("bg.elevated1")),
        selection: stripAlpha(c("bg.elevated2")),
        gutter: stripAlpha(c("bg.editor")),
        gutterForeground: stripAlpha(c("fg.disabled")),
        findHighlight: stripAlpha(c("brand.selectionAlpha")),
        activeGuide: stripAlpha(c("border.strong")),
        guide: stripAlpha(c("border.subtle")),
    };

    const rules = [
        ["Comment", "comment, punctuation.definition.comment", { foreground: stripAlpha(c("syntax.comment")), fontStyle: "italic" }],
        ["String", "string", { foreground: stripAlpha(c("syntax.string")) }],
        ["String escape", "constant.character.escape", { foreground: stripAlpha(c("syntax.stringEscape")) }],
        ["Regex", "string.regexp, string.regex", { foreground: stripAlpha(c("syntax.regex")) }],
        ["Number", "constant.numeric", { foreground: stripAlpha(c("syntax.number")) }],
        ["Boolean / null", "constant.language", { foreground: stripAlpha(c("syntax.constant")) }],
        ["Constant", "constant.other, support.constant", { foreground: stripAlpha(c("syntax.constant")) }],
        ["Keyword", "keyword, keyword.control", { foreground: stripAlpha(c("syntax.keyword")) }],
        ["Storage", "storage, storage.type, storage.modifier", { foreground: stripAlpha(c("syntax.keyword")) }],
        ["Operator", "keyword.operator", { foreground: stripAlpha(c("syntax.operator")) }],
        ["Punctuation", "punctuation, meta.brace, meta.delimiter", { foreground: stripAlpha(c("syntax.punctuation")) }],
        ["Function", "entity.name.function, support.function, meta.function-call", { foreground: stripAlpha(c("syntax.function")) }],
        ["Class / Type", "entity.name.class, entity.name.type, support.type, support.class", { foreground: stripAlpha(c("syntax.type")) }],
        ["Namespace", "entity.name.namespace, entity.name.module, entity.name.package", { foreground: stripAlpha(c("syntax.namespace")) }],
        ["Variable", "variable, variable.other", { foreground: stripAlpha(c("syntax.variable")) }],
        ["Variable parameter", "variable.parameter", { foreground: stripAlpha(c("syntax.parameter")), fontStyle: "italic" }],
        ["Variable language", "variable.language", { foreground: stripAlpha(c("syntax.languageVariable")), fontStyle: "italic" }],
        ["Property", "variable.other.property, meta.property-name, support.type.property-name", { foreground: stripAlpha(c("syntax.variable")) }],
        ["Tag", "entity.name.tag", { foreground: stripAlpha(c("syntax.tag")) }],
        ["Tag attribute", "entity.other.attribute-name", { foreground: stripAlpha(c("syntax.attribute")) }],
        ["Decorator", "meta.decorator, meta.annotation", { foreground: stripAlpha(c("syntax.decorator")) }],
        ["Markup heading", "markup.heading, entity.name.section", { foreground: stripAlpha(c("syntax.markupHeading")), fontStyle: "bold" }],
        ["Markup bold", "markup.bold", { foreground: stripAlpha(c("syntax.markupHeading")), fontStyle: "bold" }],
        ["Markup italic", "markup.italic", { foreground: stripAlpha(c("syntax.keyword")), fontStyle: "italic" }],
        ["Markup link", "markup.underline.link, string.other.link", { foreground: stripAlpha(c("syntax.markupLink")) }],
        ["Markup code", "markup.raw, markup.inline.raw", { foreground: stripAlpha(c("syntax.markupCode")) }],
        ["Markup quote", "markup.quote", { foreground: stripAlpha(c("syntax.markupQuote")), fontStyle: "italic" }],
        ["Markup list", "markup.list, punctuation.definition.list_item", { foreground: stripAlpha(c("syntax.markupHeading")) }],
        ["Diff added", "markup.inserted", { foreground: stripAlpha(c("diff.addedFg")) }],
        ["Diff removed", "markup.deleted", { foreground: stripAlpha(c("diff.removedFg")) }],
        ["Diff changed", "markup.changed", { foreground: stripAlpha(c("diff.changedFg")) }],
        ["Invalid", "invalid, invalid.illegal", { foreground: stripAlpha(c("fg.inverse")), background: stripAlpha(c("state.error")) }],
        ["Deprecated", "invalid.deprecated", { foreground: stripAlpha(c("fg.disabled")) }],
    ];

    const globalRule = ["<dict>",
        "    <key>name</key>", `    <string>${xmlEsc(label)}</string>`,
        "    <key>settings</key>", "    <dict>"];
    for (const [k, v] of Object.entries(globals)) {
        globalRule.push(`        <key>${xmlEsc(k)}</key>`, `        <string>${xmlEsc(v)}</string>`);
    }
    globalRule.push("    </dict>", "</dict>");

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>name</key>
    <string>${xmlEsc(label)}</string>
    <key>uuid</key>
    <string>${randomUUID().toUpperCase()}</string>
    <key>author</key>
    <string>Jackson Makinda</string>
    <key>colorSpaceName</key>
    <string>sRGB</string>
    <key>semanticClass</key>
    <string>theme.${isDark ? "dark" : "light"}.makinda</string>
    <key>settings</key>
    <array>
${globalRule.join("\n").split("\n").map((l) => "        " + l).join("\n").trimEnd()}
${rules.map((r) => rule(...r).split("\n").map((l) => "        " + l).join("\n").trimEnd()).join("\n")}
    </array>
</dict>
</plist>
`;
}

console.log("Building TextMate themes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/textmate/Makinda ${label}.tmTheme`, build(v));
}
