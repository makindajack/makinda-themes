#!/usr/bin/env node
/**
 * Generate BBEdit `.bbcolors` files (XML plist) from source/palette.json.
 * Output:
 *   ports/bbedit/Makinda Light.bbcolors
 *   ports/bbedit/Makinda Dark.bbcolors
 *
 * BBEdit color schemes are plists with R/G/B float (0..1) triples.
 * Install: BBEdit → Preferences → Editor → Text Colors → "+" / drop the file.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function rgbFloat(hex) {
    const h = hex.replace("#", "").slice(0, 6);
    return [
        (parseInt(h.slice(0, 2), 16) / 255).toFixed(6),
        (parseInt(h.slice(2, 4), 16) / 255).toFixed(6),
        (parseInt(h.slice(4, 6), 16) / 255).toFixed(6),
    ];
}

function colorEntry(key, hex) {
    const [r, g, b] = rgbFloat(hex);
    return `    <key>${key}</key>
    <dict>
        <key>red</key><real>${r}</real>
        <key>green</key><real>${g}</real>
        <key>blue</key><real>${b}</real>
        <key>alpha</key><real>1.000000</real>
    </dict>`;
}

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;

    const colors = [
        ["BackgroundColor", c("bg.editor")],
        ["ForegroundColor", c("fg.default")],
        ["CursorColor", c("brand.primary")],
        ["SelectionColor", c("bg.elevated2")],
        ["InvisibleCharactersColor", c("fg.disabled")],
        ["LineNumberColor", c("fg.disabled")],
        ["LineNumbersBackgroundColor", c("bg.editor")],
        ["CurrentLineColor", c("bg.elevated1")],
        ["MarkedTextColor", c("brand.primary")],
        ["FoundTextColor", c("brand.primary")],
        ["KeywordColor", c("syntax.keyword")],
        ["CommentColor", c("syntax.comment")],
        ["StringColor", c("syntax.string")],
        ["NumberColor", c("syntax.number")],
        ["AttributeColor", c("syntax.attribute")],
        ["AttributeValueColor", c("syntax.string")],
        ["TagColor", c("syntax.tag")],
        ["FunctionColor", c("syntax.function")],
        ["IdentifierColor", c("syntax.variable")],
        ["VariableColor", c("syntax.variable")],
        ["TypeColor", c("syntax.type")],
        ["PredefinedNameColor", c("syntax.constant")],
        ["ProcessingInstructionColor", c("syntax.decorator")],
        ["EntityColor", c("syntax.constant")],
        ["DOCTYPEColor", c("syntax.decorator")],
        ["CDATAColor", c("syntax.string")],
        ["HTMLSpecialColor", c("syntax.tag")],
        ["DiffOldColor", c("diff.removedFg")],
        ["DiffNewColor", c("diff.addedFg")],
        ["DiffChangedColor", c("diff.changedFg")],
        ["MarkdownHeaderColor", c("syntax.markupHeading")],
        ["MarkdownCodeColor", c("syntax.markupCode")],
        ["MarkdownLinkColor", c("syntax.markupLink")],
        ["MarkdownEmphasisColor", c("syntax.keyword")],
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>SchemeName</key>
    <string>${label}</string>
    <key>SchemeVersion</key>
    <integer>2</integer>
    <key>Author</key>
    <string>Jackson Makinda</string>
${colors.map(([k, v]) => colorEntry(k, v)).join("\n")}
</dict>
</plist>
`;
}

console.log("Building BBEdit themes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/bbedit/Makinda ${label}.bbcolors`, build(v));
}
