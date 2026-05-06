/**
 * Shared helpers for build scripts.
 * Each port reads source/palette.json and resolves dot-paths like "syntax.keyword"
 * or "bg.editor" against the chosen variant.
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
export const root = resolve(here, "..", "..");

export function loadPalette() {
    return JSON.parse(readFileSync(join(root, "source/palette.json"), "utf8"));
}

/** Resolve "syntax.keyword" against palette.variants[variant]. Throws if missing. */
export function makeResolver(palette, variant) {
    const v = palette.variants[variant];
    if (!v) throw new Error(`Unknown variant: ${variant}`);
    return function get(path) {
        const parts = path.split(".");
        let node = v;
        for (const p of parts) {
            if (node == null || typeof node !== "object" || !(p in node)) {
                throw new Error(`Missing palette role: ${variant}.${path}`);
            }
            node = node[p];
        }
        if (typeof node !== "string") {
            throw new Error(`Palette role is not a color: ${variant}.${path}`);
        }
        return node;
    };
}

export function writeOut(relPath, content) {
    const full = join(root, relPath);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
    console.log(`  wrote ${relPath}`);
}

export const VARIANTS = ["light", "dark"];
