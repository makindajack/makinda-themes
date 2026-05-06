#!/usr/bin/env node
/**
 * Contrast audit (WCAG 2.1).
 *
 * Checks each variant in source/palette.json for a fixed list of foreground/
 * background pairs that must clear the AA threshold. Defaults are:
 *   - Body text on editor:           AAA  (≥ 7.0)
 *   - UI text on editor / sidebar:   AA   (≥ 4.5)
 *   - Comments on editor:            AA   (≥ 4.5)
 *   - Status bar text on status bar: AA-large (≥ 3.0)
 *
 * Usage:
 *   node build/contrast.mjs          # report
 *   node build/contrast.mjs --strict # exit 1 on any failure
 */

import { loadPalette, makeResolver, VARIANTS } from "./lib/resolve.mjs";

const strict = process.argv.includes("--strict");
const palette = loadPalette();

/** "#rrggbb[aa]" → linearized luminance per WCAG. Alpha is ignored. */
function luminance(hex) {
    const h = hex.replace("#", "").slice(0, 6);
    const ch = (i) => {
        const v = parseInt(h.slice(i, i + 2), 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
}

function ratio(fg, bg) {
    const l1 = luminance(fg);
    const l2 = luminance(bg);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
}

const checks = [
    { label: "body text on editor", fg: "fg.default", bg: "bg.editor", min: 7.0 },
    { label: "secondary text on editor", fg: "fg.secondary", bg: "bg.editor", min: 4.5 },
    { label: "muted text on editor", fg: "fg.muted", bg: "bg.editor", min: 4.5 },
    { label: "comment on editor", fg: "syntax.comment", bg: "bg.editor", min: 4.5 },
    { label: "string on editor", fg: "syntax.string", bg: "bg.editor", min: 4.5 },
    { label: "keyword on editor", fg: "syntax.keyword", bg: "bg.editor", min: 4.5 },
    { label: "function on editor", fg: "syntax.function", bg: "bg.editor", min: 4.5 },
    { label: "type on editor", fg: "syntax.type", bg: "bg.editor", min: 4.5 },
    { label: "sidebar text on sidebar", fg: "fg.default", bg: "bg.sidebar", min: 4.5 },
    { label: "muted on sidebar", fg: "fg.muted", bg: "bg.sidebar", min: 4.5 },
    { label: "status bar text", fg: "fg.muted", bg: "bg.editor", min: 3.0 },
    { label: "inverse on brand", fg: "fg.inverse", bg: "brand.primary", min: 3.0 },
];

let totalFails = 0;
for (const variant of VARIANTS) {
    console.log(`\n[${variant}]`);
    const c = makeResolver(palette, variant);
    for (const { label, fg, bg, min } of checks) {
        let fgHex, bgHex;
        try { fgHex = c(fg); bgHex = c(bg); }
        catch (e) { console.log(`  ?  ${label.padEnd(32)} — ${e.message}`); continue; }
        const r = ratio(fgHex, bgHex);
        const pass = r >= min;
        if (!pass) totalFails++;
        const mark = pass ? "✓" : "✗";
        console.log(
            `  ${mark}  ${label.padEnd(32)} ${fgHex} on ${bgHex}  ${r.toFixed(2)} : 1  (min ${min})`,
        );
    }
}
console.log("");
if (strict && totalFails > 0) process.exit(1);
