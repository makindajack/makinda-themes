#!/usr/bin/env node
/**
 * Generate Warp YAML themes from source/palette.json.
 * Output: ports/warp/makinda_<variant>.yaml
 *
 * Install: copy to `~/.warp/themes/` (macOS) and pick from Warp's theme picker.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function render(variant) {
    const c = makeResolver(palette, variant);
    const label = variant === "dark" ? "Dark" : "Light";
    return `# Makinda ${label} \u2014 Warp theme
# Generated from source/palette.json. Do not edit by hand.
name: "Makinda ${label}"
accent: "${c("brand.primary")}"
background: "${c("bg.editor")}"
foreground: "${c("fg.default")}"
details: "${variant}"
terminal_colors:
  normal:
    black:   "${c("ansi.black")}"
    red:     "${c("ansi.red")}"
    green:   "${c("ansi.green")}"
    yellow:  "${c("ansi.yellow")}"
    blue:    "${c("ansi.blue")}"
    magenta: "${c("ansi.magenta")}"
    cyan:    "${c("ansi.cyan")}"
    white:   "${c("ansi.white")}"
  bright:
    black:   "${c("ansi.brightBlack")}"
    red:     "${c("ansi.brightRed")}"
    green:   "${c("ansi.brightGreen")}"
    yellow:  "${c("ansi.brightYellow")}"
    blue:    "${c("ansi.brightBlue")}"
    magenta: "${c("ansi.brightMagenta")}"
    cyan:    "${c("ansi.brightCyan")}"
    white:   "${c("ansi.brightWhite")}"
`;
}

console.log("Building Warp themes\u2026");
for (const v of VARIANTS) writeOut(`ports/warp/makinda_${v}.yaml`, render(v));
