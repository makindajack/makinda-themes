#!/usr/bin/env node
/**
 * Generate Ghostty themes from source/palette.json.
 * Output: ports/ghostty/Makinda Light, ports/ghostty/Makinda Dark
 *
 * Schema: https://ghostty.org/docs/config/reference#theme
 * Ghostty themes are plain config snippets. Drop into:
 *   $XDG_CONFIG_HOME/ghostty/themes/  (Linux)
 *   ~/Library/Application Support/com.mitchellh.ghostty/themes/  (macOS)
 * Then set `theme = Makinda Dark` in your config.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function stripAlpha(hex) {
    return "#" + hex.replace("#", "").slice(0, 6).toLowerCase();
}

function render(variant) {
    const c = makeResolver(palette, variant);
    const label = variant === "dark" ? "Dark" : "Light";
    const lines = [
        `# Makinda ${label} \u2014 Ghostty theme`,
        `# Generated from source/palette.json. Do not edit by hand.`,
        ``,
        `background = ${stripAlpha(c("bg.editor")).replace(/^#/, "")}`,
        `foreground = ${stripAlpha(c("fg.default")).replace(/^#/, "")}`,
        `cursor-color = ${stripAlpha(c("brand.primary")).replace(/^#/, "")}`,
        `cursor-text = ${stripAlpha(c("bg.editor")).replace(/^#/, "")}`,
        `selection-background = ${stripAlpha(c("bg.elevated2")).replace(/^#/, "")}`,
        `selection-foreground = ${stripAlpha(c("fg.default")).replace(/^#/, "")}`,
        ``,
    ];
    const ansiKeys = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
    ansiKeys.forEach((k, i) => {
        lines.push(`palette = ${i}=${stripAlpha(c(`ansi.${k}`)).replace(/^#/, "")}`);
    });
    ansiKeys.forEach((k, i) => {
        const bright = `bright${k[0].toUpperCase() + k.slice(1)}`;
        lines.push(`palette = ${i + 8}=${stripAlpha(c(`ansi.${bright}`)).replace(/^#/, "")}`);
    });
    lines.push("");
    return lines.join("\n");
}

console.log("Building Ghostty themes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/ghostty/Makinda ${label}`, render(v));
}
