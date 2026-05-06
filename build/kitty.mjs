#!/usr/bin/env node
/**
 * Generate Kitty .conf themes from source/palette.json.
 * Output: ports/kitty/makinda_<variant>.conf
 *
 * Install: copy to `~/.config/kitty/` and add `include makinda_dark.conf` to kitty.conf.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function render(variant) {
    const c = makeResolver(palette, variant);
    const label = variant === "dark" ? "Dark" : "Light";
    return `# Makinda ${label} \u2014 Kitty color scheme
# Generated from source/palette.json. Do not edit by hand.

background        ${c("bg.editor")}
foreground        ${c("fg.default")}
selection_background ${c("bg.elevated2")}
selection_foreground ${c("fg.default")}
cursor            ${c("brand.primary")}
cursor_text_color ${c("bg.editor")}
url_color         ${c("brand.primary")}

# Black
color0  ${c("ansi.black")}
color8  ${c("ansi.brightBlack")}
# Red
color1  ${c("ansi.red")}
color9  ${c("ansi.brightRed")}
# Green
color2  ${c("ansi.green")}
color10 ${c("ansi.brightGreen")}
# Yellow
color3  ${c("ansi.yellow")}
color11 ${c("ansi.brightYellow")}
# Blue
color4  ${c("ansi.blue")}
color12 ${c("ansi.brightBlue")}
# Magenta
color5  ${c("ansi.magenta")}
color13 ${c("ansi.brightMagenta")}
# Cyan
color6  ${c("ansi.cyan")}
color14 ${c("ansi.brightCyan")}
# White
color7  ${c("ansi.white")}
color15 ${c("ansi.brightWhite")}
`;
}

console.log("Building Kitty themes\u2026");
for (const v of VARIANTS) writeOut(`ports/kitty/makinda_${v}.conf`, render(v));
