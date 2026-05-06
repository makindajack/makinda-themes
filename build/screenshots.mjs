#!/usr/bin/env node
/**
 * Playwright-based screenshot generator for marketing PNGs.
 *
 * Renders a syntax-highlighted code sample as an HTML page styled with the
 * generated VS Code theme JSON, then captures Light + Dark screenshots for
 * each of: TypeScript, Python, Rust, Go, Markdown, JSON, HTML/JSX.
 *
 * Output (overwrites): images/{light,dark}-{language}.png
 *
 * Usage:
 *   npm install --save-dev playwright shiki   # one-off
 *   npm run screenshots                        # this script
 *
 * The script uses Shiki for highlighting (it understands VS Code theme JSON
 * directly) so what you see in marketing matches what users see in VS Code.
 */

import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

let chromium, getHighlighter;
try {
    ({ chromium } = await import("playwright"));
    ({ getHighlighter } = await import("shiki"));
} catch (err) {
    console.error("\nMissing peer deps. Install with:");
    console.error("  npm install --save-dev playwright shiki");
    console.error("  npx playwright install chromium\n");
    process.exit(2);
}

const samples = {
    typescript: {
        lang: "tsx",
        code: `import { useState } from "react";

interface User { id: string; name: string }

export function Profile({ user }: { user: User }) {
    const [count, setCount] = useState(0);
    return (
        <article className="card">
            <h1>{user.name}</h1>
            <button onClick={() => setCount(c => c + 1)}>
                Liked {count} {count === 1 ? "time" : "times"}
            </button>
        </article>
    );
}`,
    },
    python: {
        lang: "python",
        code: `from dataclasses import dataclass
from typing import Iterable

@dataclass(frozen=True)
class User:
    id: str
    name: str

def greet_all(users: Iterable[User]) -> list[str]:
    return [f"Hello, {u.name}!" for u in users if u.name]

if __name__ == "__main__":
    print(greet_all([User("1", "Ada"), User("2", "Linus")]))`,
    },
    rust: {
        lang: "rust",
        code: `use std::collections::HashMap;

#[derive(Debug, Clone)]
struct User<'a> { id: &'a str, name: String }

impl<'a> User<'a> {
    fn greet(&self) -> String {
        format!("Hello, {}!", self.name)
    }
}

fn main() {
    let users: HashMap<&str, User> = HashMap::from([
        ("1", User { id: "1", name: "Ada".into() }),
    ]);
    for u in users.values() { println!("{}", u.greet()); }
}`,
    },
    go: {
        lang: "go",
        code: `package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    ID   string \`json:"id"\`
    Name string \`json:"name"\`
}

func (u *User) Greet() string {
    return fmt.Sprintf("Hello, %s!", u.Name)
}

func main() {
    u := &User{ID: "1", Name: "Ada"}
    b, _ := json.Marshal(u)
    fmt.Println(string(b), u.Greet())
}`,
    },
    markdown: {
        lang: "markdown",
        code: `# Makinda Themes

> Premium **Light** and _Dark_ themes with warm orange accents.

## Install

\`\`\`bash
code --install-extension makindajack.makinda-themes
\`\`\`

- Works in VS Code, Cursor, Windsurf
- [JetBrains plugin](https://plugins.jetbrains.com/) available
- Visit <https://github.com/makindajack/makinda-themes>

| Editor   | Status |
| -------- | ------ |
| VS Code  | shipped |
| Sublime  | shipped |
| Zed      | shipped |`,
    },
    json: {
        lang: "json",
        code: `{
    "name": "makinda-themes",
    "displayName": "Makinda Themes",
    "version": "1.0.1",
    "publisher": "makindajack",
    "engines": { "vscode": "^1.74.0" },
    "categories": ["Themes"],
    "contributes": {
        "themes": [
            { "label": "Makinda Light", "uiTheme": "vs", "path": "./themes/Makinda Light-color-theme.json" },
            { "label": "Makinda Dark",  "uiTheme": "vs-dark", "path": "./themes/Makinda Dark-color-theme.json" }
        ]
    }
}`,
    },
    html: {
        lang: "html",
        code: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Makinda</title>
        <link rel="stylesheet" href="/styles.css" />
    </head>
    <body class="theme-dark">
        <main id="root" data-theme="dark">
            <h1 class="brand">Makinda</h1>
            <p>Premium themes &mdash; <a href="/install">install now</a>.</p>
        </main>
        <script src="/app.js"></script>
    </body>
</html>`,
    },
};

async function ensure(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function main() {
    const imagesDir = join(root, "images");
    await ensure(imagesDir);

    const themes = {
        light: JSON.parse(
            readFileSync(join(root, "themes/Makinda Light-color-theme.json"), "utf8"),
        ),
        dark: JSON.parse(
            readFileSync(join(root, "themes/Makinda Dark-color-theme.json"), "utf8"),
        ),
    };

    const highlighter = await getHighlighter({
        themes: [
            { ...themes.light, name: "makinda-light", type: "light" },
            { ...themes.dark, name: "makinda-dark", type: "dark" },
        ],
        langs: ["tsx", "python", "rust", "go", "markdown", "json", "html"],
    });

    const browser = await chromium.launch();
    const ctx = await browser.newContext({
        viewport: { width: 1600, height: 1000 },
        deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();

    for (const variant of ["light", "dark"]) {
        const themeName = `makinda-${variant}`;
        const editorBg = themes[variant].colors["editor.background"];
        for (const [name, { lang, code }] of Object.entries(samples)) {
            const html = highlighter.codeToHtml(code, { lang, theme: themeName });
            const doc = `<!doctype html><html><head><style>
                html, body { margin: 0; padding: 0; background: ${editorBg}; }
                body { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 64px; box-sizing: border-box; }
                pre.shiki { font-family: 'Fira Code', 'JetBrains Mono', ui-monospace, Menlo, monospace !important;
                    font-size: 14px; line-height: 1.6; padding: 32px; border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,0.18);
                    overflow: visible; max-width: 100%; }
                pre.shiki code { font-family: inherit; }
            </style></head><body>${html}</body></html>`;
            await page.setContent(doc, { waitUntil: "networkidle" });
            const out = join(imagesDir, `${variant}-${name}.png`);
            await page.screenshot({ path: out, fullPage: false });
            console.log(`  wrote images/${variant}-${name}.png`);
        }
    }

    await browser.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
