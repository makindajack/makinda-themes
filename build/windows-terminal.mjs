#!/usr/bin/env node
/**
 * Generate Windows Terminal scheme JSON snippets from source/palette.json.
 * Output: ports/windows-terminal/makinda_<variant>.json
 *
 * Install: copy the object into `schemes` array in Windows Terminal `settings.json`,
 * then set `colorScheme` on a profile to "Makinda Light" or "Makinda Dark".
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function render(variant) {
    const c = makeResolver(palette, variant);
    const scheme = {
        name: `Makinda ${variant === "dark" ? "Dark" : "Light"}`,
        background: c("bg.editor"),
        foreground: c("fg.default"),
        cursorColor: c("brand.primary"),
        selectionBackground: c("bg.elevated2"),
        black: c("ansi.black"),
        red: c("ansi.red"),
        green: c("ansi.green"),
        yellow: c("ansi.yellow"),
        blue: c("ansi.blue"),
        purple: c("ansi.magenta"),
        cyan: c("ansi.cyan"),
        white: c("ansi.white"),
        brightBlack: c("ansi.brightBlack"),
        brightRed: c("ansi.brightRed"),
        brightGreen: c("ansi.brightGreen"),
        brightYellow: c("ansi.brightYellow"),
        brightBlue: c("ansi.brightBlue"),
        brightPurple: c("ansi.brightMagenta"),
        brightCyan: c("ansi.brightCyan"),
        brightWhite: c("ansi.brightWhite"),
    };
    return JSON.stringify(scheme, null, 2) + "\n";
}

console.log("Building Windows Terminal schemes\u2026");
for (const v of VARIANTS) writeOut(`ports/windows-terminal/makinda_${v}.json`, render(v));
