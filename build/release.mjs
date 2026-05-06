#!/usr/bin/env node
/**
 * Bumps the version across all package metadata files.
 *
 * Usage:
 *   node build/release.mjs <new-version>            # bump + commit + tag
 *   node build/release.mjs <new-version> --dry-run  # print planned writes
 *   node build/release.mjs <new-version> --no-git   # bump only, no commit/tag
 *
 * Touched files:
 *   package.json                                          (root extension)
 *   source/palette.json                                   (palette version)
 *   ports/sublime/package.json                            (Package Control)
 *   ports/zed/extension.toml                              (Zed registry)
 *   ports/jetbrains/gradle.properties                     (JetBrains plugin)
 *   ports/nova/Makinda.novaextension/extension.json      (Nova manifest)
 *   ports/obsidian/manifest.json                          (Obsidian theme)
 *
 * Files only updated if they actually exist.
 *
 * Git: when `--no-git` is not set and the working tree is clean (post-bump),
 * commits the changes as `chore: release vX.Y.Z` and creates an annotated tag
 * `vX.Y.Z`. Push manually with `git push --follow-tags`.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const args = process.argv.slice(2);
const version = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const noGit = args.includes("--no-git");

if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
    console.error("usage: node build/release.mjs <semver> [--dry-run] [--no-git]");
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
    ops.push({ path: relPath, content: JSON.stringify(data, null, 2) + "\n" });
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
jsonField("ports/nova/Makinda.novaextension/extension.json", "version");
jsonField("ports/obsidian/manifest.json", "version");
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

if (dryRun) process.exit(0);

console.log(`\nBumped ${ops.length} file(s) to ${version}.`);

if (noGit) {
    console.log("Skipped git commit/tag (--no-git).");
    process.exit(0);
}

function git(cmd) {
    return execSync(`git ${cmd}`, { cwd: root, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

try {
    git("rev-parse --is-inside-work-tree");
} catch {
    console.log("Not a git repo; skipping commit/tag.");
    process.exit(0);
}

try {
    const existing = git(`tag --list v${version}`);
    if (existing) {
        console.error(`Tag v${version} already exists. Aborting.`);
        process.exit(1);
    }
    const paths = ops.map((o) => `"${o.path}"`).join(" ");
    execSync(`git add ${paths}`, { cwd: root, stdio: "inherit" });
    execSync(`git commit -m "chore: release v${version}"`, { cwd: root, stdio: "inherit" });
    execSync(`git tag -a v${version} -m "Release v${version}"`, { cwd: root, stdio: "inherit" });
    console.log(`\nCommitted and tagged v${version}.`);
    console.log("Push with: git push --follow-tags");
} catch (err) {
    console.error(`git step failed: ${err.message}`);
    process.exit(1);
}

