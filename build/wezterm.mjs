#!/usr/bin/env node
/**
 * Generate WezTerm Lua themes from source/palette.json.
 * Output: ports/wezterm/makinda.lua  (returns a table indexed by scheme name)
 *
 * Install: copy/symlink into `~/.config/wezterm/colors/` or use directly:
 *
 *   local wez = require('wezterm')
 *   local schemes = require('makinda')
 *   return { color_schemes = schemes, color_scheme = 'Makinda Dark' }
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function stripAlpha(hex) {
    return "#" + hex.replace("#", "").slice(0, 6).toLowerCase();
}

function schemeBlock(variant) {
    const c = makeResolver(palette, variant);
    const label = variant === "dark" ? "Dark" : "Light";
    const ansiOrder = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
    const ansi = ansiOrder.map((k) => `"${stripAlpha(c(`ansi.${k}`))}"`).join(", ");
    const brights = ansiOrder
        .map((k) => `"${stripAlpha(c(`ansi.bright${k[0].toUpperCase() + k.slice(1)}`))}"`)
        .join(", ");

    return `    ["Makinda ${label}"] = {
        foreground = "${stripAlpha(c("fg.default"))}",
        background = "${stripAlpha(c("bg.editor"))}",
        cursor_bg = "${stripAlpha(c("brand.primary"))}",
        cursor_fg = "${stripAlpha(c("bg.editor"))}",
        cursor_border = "${stripAlpha(c("brand.primary"))}",
        selection_bg = "${stripAlpha(c("bg.elevated2"))}",
        selection_fg = "${stripAlpha(c("fg.default"))}",
        scrollbar_thumb = "${stripAlpha(c("border.strong"))}",
        split = "${stripAlpha(c("border.default"))}",
        ansi   = { ${ansi} },
        brights = { ${brights} },
        indexed = {},
        compose_cursor = "${stripAlpha(c("brand.primaryHover"))}",
        tab_bar = {
            background = "${stripAlpha(c("bg.editor"))}",
            active_tab = {
                bg_color = "${stripAlpha(c("bg.tabActive"))}",
                fg_color = "${stripAlpha(c("fg.default"))}",
                intensity = "Bold",
            },
            inactive_tab = {
                bg_color = "${stripAlpha(c("bg.elevated1"))}",
                fg_color = "${stripAlpha(c("fg.muted"))}",
            },
            inactive_tab_hover = {
                bg_color = "${stripAlpha(c("bg.elevated2"))}",
                fg_color = "${stripAlpha(c("fg.default"))}",
            },
            new_tab = {
                bg_color = "${stripAlpha(c("bg.editor"))}",
                fg_color = "${stripAlpha(c("fg.muted"))}",
            },
            new_tab_hover = {
                bg_color = "${stripAlpha(c("bg.elevated1"))}",
                fg_color = "${stripAlpha(c("fg.default"))}",
            },
        },
    },`;
}

const out = `-- Makinda Themes \u2014 WezTerm color schemes.
-- Generated from source/palette.json. Do not edit by hand.
--
-- Usage:
--   local wez = require('wezterm')
--   local makinda = require('makinda')   -- when this file is on package.path
--   return {
--       color_schemes = makinda,
--       color_scheme = 'Makinda Dark',
--   }
return {
${VARIANTS.map(schemeBlock).join("\n")}
}
`;

console.log("Building WezTerm theme\u2026");
writeOut("ports/wezterm/makinda.lua", out);
