#!/usr/bin/env node
/**
 * Orchestrator: runs every port generator under build/ and validates first.
 * Each port is a sibling .mjs that does its own writes; this just sequences them.
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const ports = [
    "vscode.mjs",
    "alacritty.mjs",
    "kitty.mjs",
    "warp.mjs",
    "windows-terminal.mjs",
    "iterm2.mjs",
];

function run(file) {
    const r = spawnSync(process.execPath, [join(here, file)], { stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log("\u2192 validate\n");
run("validate.mjs");

console.log("\n\u2192 build ports\n");
for (const p of ports) run(p);

console.log("\nAll ports generated under ports/.");
