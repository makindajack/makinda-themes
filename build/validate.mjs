#!/usr/bin/env node
/**
 * validate.mjs — Phase 0 audit tool.
 *
 * Scans themes/Makinda Light-color-theme.json and themes/Makinda Dark-color-theme.json,
 * extracts every hex color used, and reports which ones are NOT defined in
 * source/palette.json. The goal is to drive the palette/themes toward a 1:1
 * relationship so future ports can be generated mechanically.
 *
 * Usage:
 *   node build/validate.mjs            # human report
 *   node build/validate.mjs --json     # machine-readable
 *   node build/validate.mjs --strict   # exit 1 if any stragglers
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const strict = args.has("--strict");

const palette = JSON.parse(readFileSync(join(root, "source/palette.json"), "utf8"));

/** Recursively collect every hex string (#rgb, #rrggbb, #rrggbbaa) from an object. */
function collectHex(node, out = new Set()) {
    if (node == null) return out;
    if (typeof node === "string") {
        if (/^#[0-9a-fA-F]{3,8}$/.test(node)) out.add(node.toLowerCase());
        return out;
    }
    if (Array.isArray(node)) {
        for (const v of node) collectHex(v, out);
        return out;
    }
    if (typeof node === "object") {
        for (const v of Object.values(node)) collectHex(v, out);
    }
    return out;
}

/** Normalize a hex to its base #rrggbb (drops alpha) for palette comparison. */
function base(hex) {
    if (/^#[0-9a-fA-F]{8}$/.test(hex)) return hex.slice(0, 7).toLowerCase();
    if (/^#[0-9a-fA-F]{4}$/.test(hex)) return hex.slice(0, 4).toLowerCase();
    return hex.toLowerCase();
}

const variants = ["light", "dark"];
const themeFiles = {
    light: "themes/Makinda Light-color-theme.json",
    dark: "themes/Makinda Dark-color-theme.json",
};

const report = {};
for (const variant of variants) {
    const paletteColors = new Set();
    collectHex(palette.variants[variant], paletteColors);
    const paletteBases = new Set([...paletteColors].map(base));

    const theme = JSON.parse(readFileSync(join(root, themeFiles[variant]), "utf8"));
    const themeColors = collectHex(theme);

    const stragglers = [];
    for (const c of themeColors) {
        if (!paletteBases.has(base(c))) stragglers.push(c);
    }

    report[variant] = {
        paletteCount: paletteColors.size,
        themeColorCount: themeColors.size,
        stragglerCount: stragglers.length,
        stragglers: stragglers.sort(),
    };
}

if (asJson) {
    console.log(JSON.stringify(report, null, 2));
} else {
    for (const variant of variants) {
        const r = report[variant];
        const ok = r.stragglerCount === 0;
        console.log(`\n[${variant}]`);
        console.log(`  palette colors:      ${r.paletteCount}`);
        console.log(`  theme colors used:   ${r.themeColorCount}`);
        console.log(`  not in palette:      ${r.stragglerCount} ${ok ? "✓" : "✗"}`);
        if (!ok) {
            for (const c of r.stragglers) console.log(`    ${c}`);
        }
    }
    console.log("");
}

const totalStragglers = variants.reduce((n, v) => n + report[v].stragglerCount, 0);
if (strict && totalStragglers > 0) process.exit(1);
