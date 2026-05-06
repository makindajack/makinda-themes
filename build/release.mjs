#!/usr/bin/env node
/**
 * Bumps the version across all package metadata files.
 *
 * Usage:
 *   node build/release.mjs <new-version>            # bumps + writes
 *   node build/release.mjs <new-version> --dry-run  # prints planned writes
 *
 * Touched files:
 *   package.json                                          (root extension)
 *   source/palette.json                                   (palette version)
 *   ports/sublime/package.json                            (Package Control)
 *   ports/zed/extension.toml                              (Zed registry)
 *   ports/jetbrains/gradle.properties                     (JetBrains plugin)
 *
 * Files only updated if they actually exist.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const args = process.argv.slice(2);
const version = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");

if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
    console.error("usage: node build/release.mjs <semver> [--dry-run]");
    process.exit(2);
}

const ops = [];

function jsonField(relPath, key) {
    const full = join(root, relPath);
    if (!existsSync(full)) return;
    const data = JSON.parse(readFileSync(full, "utf8"));
    if (!(key in data)) return;
    if (data[key] === version) return;
    data[key] = version;
    ops.push({ path: relPath, content: JSON.stringify(data, null, key === "version" ? (relPath === "package.json" ? 2 : 2) : 2) + "\n" });
}

function regex(relPath, pattern, replace) {
    const full = join(root, relPath);
    if (!existsSync(full)) return;
    const text = readFileSync(full, "utf8");
    const next = text.replace(pattern, replace);
    if (next !== text) ops.push({ path: relPath, content: next });
}

jsonField("package.json", "version");
jsonField("source/palette.json", "version");
jsonField("ports/sublime/package.json", "version");
regex("ports/zed/extension.toml", /^version\s*=\s*"[^"]+"/m, `version = "${version}"`);
regex("ports/jetbrains/gradle.properties", /^pluginVersion\s*=.*$/m, `pluginVersion=${version}`);

if (ops.length === 0) {
    console.log(`No changes; everything already at ${version}.`);
    process.exit(0);
}

for (const op of ops) {
    if (dryRun) {
        console.log(`would write ${op.path}`);
    } else {
        writeFileSync(join(root, op.path), op.content);
        console.log(`wrote ${op.path}`);
    }
}

if (!dryRun) {
    console.log(`\nBumped ${ops.length} file(s) to ${version}.`);
    console.log("Next: commit, tag, and run npm run build && git push --follow-tags.");
}
