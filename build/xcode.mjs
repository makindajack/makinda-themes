#!/usr/bin/env node
/**
 * Xcode theme port.
 *
 * Generates `.xccolortheme` plists (XML plist v1.0) for both variants from
 * source/palette.json. Xcode color theme keys are well-documented in
 * community sources; the schema is a flat plist of:
 *   DVTConsole*, DVTSourceTextBackground, DVTSourceTextSelectionColor,
 *   DVTSourceTextInsertionPointColor, DVTSourceTextCurrentLineHighlightColor,
 *   DVTSourceTextSyntaxColors / DVTSourceTextSyntaxFonts (per token type).
 *
 * Color values are encoded as space-separated "r g b a" with 0..1 floats.
 *
 * Output:
 *   ports/xcode/Makinda Light.xccolortheme
 *   ports/xcode/Makinda Dark.xccolortheme
 *   ports/xcode/install.sh
 *   ports/xcode/README.md  (kept hand-edited; not regenerated)
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function hexToFloat(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a].map((n) => n.toFixed(6).replace(/0+$/, "").replace(/\.$/, ".0")).join(" ");
}

const FONT = "SFMono-Regular - 12.0";
const FONT_BOLD = "SFMono-Bold - 12.0";
const FONT_ITALIC = "SFMono-RegularItalic - 12.0";

function buildTheme(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";

    const bg = c("bg.editor");
    const fg = c("fg.default");
    const cursor = c("brand.primary");
    const selection = c("bg.elevated2");
    const currentLine = c("bg.elevated1");
    const invisibles = c("fg.disabled");
    const gutterBg = c("bg.editor");
    const gutterFg = c("fg.disabled");

    // Map palette → Xcode token types.
    const tokens = [
        ["xcode.syntax.attribute", c("syntax.decorator"), FONT],
        ["xcode.syntax.character", c("syntax.string"), FONT],
        ["xcode.syntax.comment", c("syntax.comment"), FONT_ITALIC],
        ["xcode.syntax.comment.doc", c("syntax.comment"), FONT_ITALIC],
        ["xcode.syntax.comment.doc.keyword", c("syntax.keyword"), FONT_ITALIC],
        ["xcode.syntax.declaration.other", c("syntax.function"), FONT],
        ["xcode.syntax.declaration.type", c("syntax.type"), FONT_BOLD],
        ["xcode.syntax.identifier.class", c("syntax.type"), FONT],
        ["xcode.syntax.identifier.class.system", c("syntax.type"), FONT],
        ["xcode.syntax.identifier.constant", c("syntax.constant"), FONT],
        ["xcode.syntax.identifier.constant.system", c("syntax.constant"), FONT],
        ["xcode.syntax.identifier.function", c("syntax.function"), FONT],
        ["xcode.syntax.identifier.function.system", c("syntax.function"), FONT],
        ["xcode.syntax.identifier.macro", c("syntax.decorator"), FONT],
        ["xcode.syntax.identifier.macro.system", c("syntax.decorator"), FONT],
        ["xcode.syntax.identifier.type", c("syntax.type"), FONT],
        ["xcode.syntax.identifier.type.system", c("syntax.type"), FONT],
        ["xcode.syntax.identifier.variable", c("syntax.variable"), FONT],
        ["xcode.syntax.identifier.variable.system", c("syntax.variable"), FONT],
        ["xcode.syntax.keyword", c("syntax.keyword"), FONT_BOLD],
        ["xcode.syntax.mark", c("fg.muted"), FONT],
        ["xcode.syntax.markup", c("syntax.markupHeading"), FONT],
        ["xcode.syntax.number", c("syntax.number"), FONT],
        ["xcode.syntax.plain", fg, FONT],
        ["xcode.syntax.preprocessor", c("syntax.decorator"), FONT],
        ["xcode.syntax.string", c("syntax.string"), FONT],
        ["xcode.syntax.url", c("syntax.markupLink"), FONT],
    ];

    const syntaxColorsLines = [];
    const syntaxFontsLines = [];
    for (const [key, color, font] of tokens) {
        syntaxColorsLines.push(`        <key>${key}</key>`, `        <string>${hexToFloat(color)}</string>`);
        syntaxFontsLines.push(`        <key>${key}</key>`, `        <string>${font}</string>`);
    }

    // Console (debugger output).
    const consoleEntries = [
        ["DVTConsoleDebuggerInputTextColor", c("brand.primary"), FONT_BOLD],
        ["DVTConsoleDebuggerOutputTextColor", c("syntax.string"), FONT],
        ["DVTConsoleDebuggerPromptTextColor", c("brand.primary"), FONT_BOLD],
        ["DVTConsoleExectuableInputTextColor", fg, FONT],
        ["DVTConsoleExectuableOutputTextColor", fg, FONT],
    ];
    const consoleLines = [];
    for (const [key, color, font] of consoleEntries) {
        consoleLines.push(
            `    <key>${key}Color</key>`,
            `    <string>${hexToFloat(color)}</string>`,
            `    <key>${key}Font</key>`,
            `    <string>${font}</string>`,
        );
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<!-- Makinda ${isDark ? "Dark" : "Light"} \u2014 Xcode color theme. Generated from source/palette.json. -->
<plist version="1.0">
<dict>
    <key>DVTConsoleDebuggerInputTextColor</key>
    <string>${hexToFloat(c("brand.primary"))}</string>
    <key>DVTConsoleDebuggerInputTextFont</key>
    <string>${FONT_BOLD}</string>
    <key>DVTConsoleDebuggerOutputTextColor</key>
    <string>${hexToFloat(c("syntax.string"))}</string>
    <key>DVTConsoleDebuggerOutputTextFont</key>
    <string>${FONT}</string>
    <key>DVTConsoleDebuggerPromptTextColor</key>
    <string>${hexToFloat(c("brand.primary"))}</string>
    <key>DVTConsoleDebuggerPromptTextFont</key>
    <string>${FONT_BOLD}</string>
    <key>DVTConsoleExectuableInputTextColor</key>
    <string>${hexToFloat(fg)}</string>
    <key>DVTConsoleExectuableInputTextFont</key>
    <string>${FONT}</string>
    <key>DVTConsoleExectuableOutputTextColor</key>
    <string>${hexToFloat(fg)}</string>
    <key>DVTConsoleExectuableOutputTextFont</key>
    <string>${FONT}</string>
    <key>DVTConsoleTextBackgroundColor</key>
    <string>${hexToFloat(bg)}</string>
    <key>DVTConsoleTextInsertionPointColor</key>
    <string>${hexToFloat(cursor)}</string>
    <key>DVTConsoleTextSelectionColor</key>
    <string>${hexToFloat(selection)}</string>
    <key>DVTDebuggerInstructionPointerColor</key>
    <string>${hexToFloat(c("brand.primary"))}</string>
    <key>DVTLineSpacing</key>
    <real>1.10</real>
    <key>DVTMarkupTextBackgroundColor</key>
    <string>${hexToFloat(bg)}</string>
    <key>DVTMarkupTextBorderColor</key>
    <string>${hexToFloat(c("border.default"))}</string>
    <key>DVTMarkupTextCodeFont</key>
    <string>${FONT}</string>
    <key>DVTMarkupTextEmphasisColor</key>
    <string>${hexToFloat(c("syntax.markupHeading"))}</string>
    <key>DVTMarkupTextEmphasisFont</key>
    <string>${FONT_ITALIC}</string>
    <key>DVTMarkupTextInlineCodeBackgroundColor</key>
    <string>${hexToFloat(c("bg.elevated1"))}</string>
    <key>DVTMarkupTextLinkColor</key>
    <string>${hexToFloat(c("syntax.markupLink"))}</string>
    <key>DVTMarkupTextLinkFont</key>
    <string>${FONT}</string>
    <key>DVTMarkupTextNormalColor</key>
    <string>${hexToFloat(fg)}</string>
    <key>DVTMarkupTextNormalFont</key>
    <string>${FONT}</string>
    <key>DVTMarkupTextOtherHeadingColor</key>
    <string>${hexToFloat(c("syntax.markupHeading"))}</string>
    <key>DVTMarkupTextOtherHeadingFont</key>
    <string>${FONT_BOLD}</string>
    <key>DVTMarkupTextPrimaryHeadingColor</key>
    <string>${hexToFloat(c("syntax.markupHeading"))}</string>
    <key>DVTMarkupTextPrimaryHeadingFont</key>
    <string>${FONT_BOLD}</string>
    <key>DVTMarkupTextSecondaryHeadingColor</key>
    <string>${hexToFloat(c("syntax.markupHeading"))}</string>
    <key>DVTMarkupTextSecondaryHeadingFont</key>
    <string>${FONT_BOLD}</string>
    <key>DVTMarkupTextStrongColor</key>
    <string>${hexToFloat(c("syntax.markupHeading"))}</string>
    <key>DVTMarkupTextStrongFont</key>
    <string>${FONT_BOLD}</string>
    <key>DVTSourceTextBackground</key>
    <string>${hexToFloat(bg)}</string>
    <key>DVTSourceTextBlockDimBackgroundColor</key>
    <string>${hexToFloat(c("bg.elevated1"))}</string>
    <key>DVTSourceTextCurrentLineHighlightColor</key>
    <string>${hexToFloat(currentLine)}</string>
    <key>DVTSourceTextInsertionPointColor</key>
    <string>${hexToFloat(cursor)}</string>
    <key>DVTSourceTextInvisiblesColor</key>
    <string>${hexToFloat(invisibles)}</string>
    <key>DVTSourceTextSelectionColor</key>
    <string>${hexToFloat(selection)}</string>
    <key>DVTSourceTextSyntaxColors</key>
    <dict>
${syntaxColorsLines.join("\n")}
    </dict>
    <key>DVTSourceTextSyntaxFonts</key>
    <dict>
${syntaxFontsLines.join("\n")}
    </dict>
    <key>DVTGutterBackgroundColor</key>
    <string>${hexToFloat(gutterBg)}</string>
    <key>DVTGutterForegroundColor</key>
    <string>${hexToFloat(gutterFg)}</string>
    <key>DVTLineNumbersForegroundColor</key>
    <string>${hexToFloat(gutterFg)}</string>
    <key>DVTSourceFindHighlightColor</key>
    <string>${hexToFloat(c("brand.selectionAlpha"))}</string>
</dict>
</plist>
`;
}

const INSTALL_SH = `#!/usr/bin/env bash
# Install Makinda Themes for Xcode.
#
# Copies both .xccolortheme files into Xcode's user themes directory:
#   ~/Library/Developer/Xcode/UserData/FontAndColorThemes/
#
# Run from this directory:
#   chmod +x install.sh && ./install.sh

set -euo pipefail

DEST="$HOME/Library/Developer/Xcode/UserData/FontAndColorThemes"
SRC="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$DEST"

for f in "Makinda Light.xccolortheme" "Makinda Dark.xccolortheme"; do
    if [[ ! -f "$SRC/$f" ]]; then
        echo "missing: $SRC/$f" >&2
        exit 1
    fi
    cp "$SRC/$f" "$DEST/$f"
    echo "installed: $DEST/$f"
done

echo
echo "Restart Xcode, then choose: Xcode \u2192 Settings \u2192 Themes \u2192 Makinda Light / Dark."
`;

console.log("Building Xcode themes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/xcode/Makinda ${label}.xccolortheme`, buildTheme(v));
}
writeOut("ports/xcode/install.sh", INSTALL_SH);
