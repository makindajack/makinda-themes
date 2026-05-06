/**
 * Generates VS Code theme JSONs from source/vscode/{light,dark}.json.
 *
 * For now the source files mirror the workbench/syntax structure with literal
 * hex values; the validator (build/validate.mjs) keeps every hex anchored to
 * source/palette.json. Future iterations will progressively replace literal
 * hex values with palette role references.
 *
 * Output (matches current marketplace package paths):
 *   themes/Makinda Light-color-theme.json
 *   themes/Makinda Dark-color-theme.json
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { root, VARIANTS, writeOut } from "./lib/resolve.mjs";

const OUT = {
    light: "themes/Makinda Light-color-theme.json",
    dark: "themes/Makinda Dark-color-theme.json",
};

function loadSource(variant) {
    const raw = readFileSync(join(root, `source/vscode/${variant}.json`), "utf8");
    return JSON.parse(raw);
}

function buildTheme(variant) {
    const src = loadSource(variant);
    // Strip internal _comment field; preserve canonical key order.
    const theme = {
        name: src.name,
        type: src.type,
        semanticHighlighting: src.semanticHighlighting !== false,
        semanticTokenColors: src.semanticTokenColors,
        tokenColors: src.tokenColors,
        colors: src.colors,
    };
    let out = JSON.stringify(theme, null, 2);
    // Match the existing formatting style: inline short scope arrays of quoted
    // strings (those whose collapsed form fits within ~100 chars). Long arrays
    // remain multi-line, matching the hand-curated output.
    out = out.replace(
        /\[\n((?:\s+"(?:[^"\\]|\\.)*",?\n)+)\s+\]/g,
        (match, inner) => {
            const items = inner.match(/"(?:[^"\\]|\\.)*"/g) || [];
            const inline = "[" + items.join(", ") + "]";
            return inline.length <= 100 ? inline : match;
        },
    );
    return out + "\n";
}

console.log("Building VS Code themes…");
for (const variant of VARIANTS) {
    writeOut(OUT[variant], buildTheme(variant));
}
