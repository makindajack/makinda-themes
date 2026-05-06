#!/usr/bin/env node
/**
 * Generate Alacritty TOML themes from source/palette.json.
 * Output: ports/alacritty/makinda_<variant>.toml
 *
 * Drop in: `~/.config/alacritty/themes/` then `import = ["..."]` in alacritty.toml.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function render(variant) {
    const c = makeResolver(palette, variant);
    return `# Makinda ${variant === "dark" ? "Dark" : "Light"} \u2014 Alacritty theme
# Generated from source/palette.json. Do not edit by hand.

[colors.primary]
background = "${c("bg.editor")}"
foreground = "${c("fg.default")}"

[colors.cursor]
text   = "${c("bg.editor")}"
cursor = "${c("brand.primary")}"

[colors.selection]
text       = "${c("fg.default")}"
background = "${c("bg.elevated2")}"

[colors.normal]
black   = "${c("ansi.black")}"
red     = "${c("ansi.red")}"
green   = "${c("ansi.green")}"
yellow  = "${c("ansi.yellow")}"
blue    = "${c("ansi.blue")}"
magenta = "${c("ansi.magenta")}"
cyan    = "${c("ansi.cyan")}"
white   = "${c("ansi.white")}"

[colors.bright]
black   = "${c("ansi.brightBlack")}"
red     = "${c("ansi.brightRed")}"
green   = "${c("ansi.brightGreen")}"
yellow  = "${c("ansi.brightYellow")}"
blue    = "${c("ansi.brightBlue")}"
magenta = "${c("ansi.brightMagenta")}"
cyan    = "${c("ansi.brightCyan")}"
white   = "${c("ansi.brightWhite")}"
`;
}

console.log("Building Alacritty themes\u2026");
for (const v of VARIANTS) writeOut(`ports/alacritty/makinda_${v}.toml`, render(v));
