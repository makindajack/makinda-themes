#!/usr/bin/env node
/**
 * Generate Slack sidebar theme strings from source/palette.json.
 * Output: ports/slack/sidebar-themes.txt
 *
 * Slack accepts a comma-separated list of 8 hex colors:
 *   Column BG, Menu BG hover, Active item, Active item text,
 *   Hover item, Text color, Active presence, Mentions badge.
 *
 * Paste into Preferences \u2192 Themes \u2192 Custom theme.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function row(variant) {
    const c = makeResolver(palette, variant);
    return [
        c("bg.sidebar"),
        c("bg.elevated2"),
        c("brand.primary"),
        c("fg.inverse"),
        c("bg.elevated1"),
        c("fg.default"),
        c("state.success"),
        c("state.error"),
    ].map((h) => h.replace("#", "").slice(0, 6).toUpperCase()).map((h) => "#" + h).join(",");
}

const lines = [
    "# Makinda Themes \u2014 Slack sidebar themes",
    "# Paste one of these into Slack \u2192 Preferences \u2192 Themes \u2192 Customize \u2192 Colors.",
    "",
    "## Makinda Light",
    row("light"),
    "",
    "## Makinda Dark",
    row("dark"),
    "",
];

console.log("Building Slack sidebar themes\u2026");
writeOut("ports/slack/sidebar-themes.txt", lines.join("\n"));
