#!/usr/bin/env node
/**
 * Generate iTerm2 .itermcolors (plist) themes from source/palette.json.
 * Output: ports/iterm2/Makinda <Variant>.itermcolors
 *
 * Install: double-click the file or import in iTerm2 \u2192 Preferences \u2192 Profiles \u2192 Colors \u2192 Color Presets.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

/** "#rrggbb" \u2192 { r, g, b } in 0\u20131 floats. Alpha (#rrggbbaa) is dropped. */
function rgb(hex) {
    const h = hex.replace("#", "").slice(0, 6);
    return {
        r: parseInt(h.slice(0, 2), 16) / 255,
        g: parseInt(h.slice(2, 4), 16) / 255,
        b: parseInt(h.slice(4, 6), 16) / 255,
    };
}

function colorEntry(key, hex) {
    const { r, g, b } = rgb(hex);
    return `\t<key>${key}</key>
\t<dict>
\t\t<key>Alpha Component</key>
\t\t<real>1</real>
\t\t<key>Blue Component</key>
\t\t<real>${b}</real>
\t\t<key>Color Space</key>
\t\t<string>sRGB</string>
\t\t<key>Green Component</key>
\t\t<real>${g}</real>
\t\t<key>Red Component</key>
\t\t<real>${r}</real>
\t</dict>`;
}

function render(variant) {
    const c = makeResolver(palette, variant);
    const slots = [
        ["Ansi 0 Color", c("ansi.black")],
        ["Ansi 1 Color", c("ansi.red")],
        ["Ansi 2 Color", c("ansi.green")],
        ["Ansi 3 Color", c("ansi.yellow")],
        ["Ansi 4 Color", c("ansi.blue")],
        ["Ansi 5 Color", c("ansi.magenta")],
        ["Ansi 6 Color", c("ansi.cyan")],
        ["Ansi 7 Color", c("ansi.white")],
        ["Ansi 8 Color", c("ansi.brightBlack")],
        ["Ansi 9 Color", c("ansi.brightRed")],
        ["Ansi 10 Color", c("ansi.brightGreen")],
        ["Ansi 11 Color", c("ansi.brightYellow")],
        ["Ansi 12 Color", c("ansi.brightBlue")],
        ["Ansi 13 Color", c("ansi.brightMagenta")],
        ["Ansi 14 Color", c("ansi.brightCyan")],
        ["Ansi 15 Color", c("ansi.brightWhite")],
        ["Background Color", c("bg.editor")],
        ["Foreground Color", c("fg.default")],
        ["Bold Color", c("fg.default")],
        ["Cursor Color", c("brand.primary")],
        ["Cursor Text Color", c("bg.editor")],
        ["Selection Color", c("bg.elevated2")],
        ["Selected Text Color", c("fg.default")],
        ["Link Color", c("brand.primary")],
        ["Badge Color", c("brand.primary")],
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${slots.map(([k, v]) => colorEntry(k, v)).join("\n")}
</dict>
</plist>
`;
}

console.log("Building iTerm2 themes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/iterm2/Makinda ${label}.itermcolors`, render(v));
}
