#!/usr/bin/env node
/**
 * Generate an Obsidian theme from source/palette.json.
 * Output:
 *   ports/obsidian/theme.css        (single file with both variants)
 *   ports/obsidian/manifest.json    (Obsidian theme manifest)
 *
 * Install (manual): drop both files into
 *   <vault>/.obsidian/themes/Makinda/
 * Then enable via Settings \u2192 Appearance \u2192 Themes \u2192 Makinda.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function vars(variant) {
    const c = makeResolver(palette, variant);
    return `    --background-primary: ${c("bg.editor")};
    --background-primary-alt: ${c("bg.elevated1")};
    --background-secondary: ${c("bg.sidebar")};
    --background-secondary-alt: ${c("bg.elevated1")};
    --background-modifier-border: ${c("border.default")};
    --background-modifier-border-hover: ${c("border.strong")};
    --background-modifier-form-field: ${c("bg.input")};
    --background-modifier-hover: ${c("bg.elevated1")};
    --background-modifier-active-hover: ${c("bg.elevated2")};
    --background-modifier-success: ${c("state.success")};
    --background-modifier-error: ${c("state.error")};
    --background-modifier-error-hover: ${c("state.errorStrong")};
    --background-modifier-error-rgb: 239, 68, 68;
    --background-modifier-cover: rgba(0, 0, 0, 0.5);
    --interactive-normal: ${c("fg.secondary")};
    --interactive-hover: ${c("fg.default")};
    --interactive-accent: ${c("brand.primary")};
    --interactive-accent-hover: ${c("brand.primaryHover")};
    --interactive-accent-rgb: 240, 81, 6;
    --text-normal: ${c("fg.default")};
    --text-muted: ${c("fg.muted")};
    --text-faint: ${c("fg.subtle")};
    --text-on-accent: ${c("fg.inverse")};
    --text-error: ${c("state.error")};
    --text-error-hover: ${c("state.errorStrong")};
    --text-highlight-bg: ${c("brand.selectionAlpha")};
    --text-highlight-bg-active: ${c("brand.primaryHover")};
    --text-selection: ${c("bg.elevated2")};
    --text-accent: ${c("brand.primary")};
    --text-accent-hover: ${c("brand.primaryHover")};

    --h1-color: ${c("syntax.markupHeading")};
    --h2-color: ${c("syntax.markupHeading")};
    --h3-color: ${c("syntax.markupHeading")};
    --h4-color: ${c("syntax.markupHeading")};
    --h5-color: ${c("syntax.markupHeading")};
    --h6-color: ${c("syntax.markupHeading")};

    --link-color: ${c("syntax.markupLink")};
    --link-color-hover: ${c("brand.primary")};
    --link-external-color: ${c("syntax.markupLink")};
    --link-external-color-hover: ${c("brand.primary")};
    --link-unresolved-color: ${c("state.warning")};

    --code-normal: ${c("syntax.markupCode")};
    --code-background: ${c("bg.elevated1")};
    --code-keyword: ${c("syntax.keyword")};
    --code-function: ${c("syntax.function")};
    --code-string: ${c("syntax.string")};
    --code-tag: ${c("syntax.tag")};
    --code-property: ${c("syntax.attribute")};
    --code-comment: ${c("syntax.comment")};
    --code-value: ${c("syntax.constant")};
    --code-operator: ${c("syntax.operator")};
    --code-punctuation: ${c("syntax.punctuation")};
    --code-important: ${c("state.error")};

    --tag-color: ${c("brand.primary")};
    --tag-background: ${c("bg.elevated1")};
    --tag-background-hover: ${c("bg.elevated2")};

    --blockquote-border-color: ${c("brand.primary")};
    --blockquote-color: ${c("syntax.markupQuote")};

    --hr-color: ${c("border.default")};
    --table-header-background: ${c("bg.elevated1")};
    --table-row-alt-background: ${c("bg.elevated1")};
    --table-row-hover-background: ${c("bg.elevated2")};

    --titlebar-background: ${c("bg.titlebar")};
    --titlebar-background-focused: ${c("bg.titlebar")};
    --titlebar-text-color: ${c("fg.default")};
    --titlebar-text-color-focused: ${c("fg.default")};

    --ribbon-background: ${c("bg.activitybar")};
    --tab-background-active: ${c("bg.tabActive")};
    --tab-text-color-focused-active-current: ${c("fg.default")};

    --vault-name-color: ${c("brand.primary")};
    --status-bar-background: ${c("bg.titlebar")};
    --scrollbar-bg: transparent;
    --scrollbar-thumb-bg: ${c("border.strong")};
    --scrollbar-active-thumb-bg: ${c("brand.primary")};
`;
}

const css = `/*
 * Makinda Themes \u2014 Obsidian
 * Generated from source/palette.json. Do not edit by hand.
 *
 * Auto-switches with Obsidian's appearance setting.
 */

.theme-light {
${vars("light")}}

.theme-dark {
${vars("dark")}}

/* Subtle code highlighting that works in both themes */
.cm-s-obsidian span.cm-keyword { color: var(--code-keyword); }
.cm-s-obsidian span.cm-string { color: var(--code-string); }
.cm-s-obsidian span.cm-number { color: var(--code-value); }
.cm-s-obsidian span.cm-comment { color: var(--code-comment); font-style: italic; }
.cm-s-obsidian span.cm-tag { color: var(--code-tag); }
.cm-s-obsidian span.cm-attribute { color: var(--code-property); }
.cm-s-obsidian span.cm-operator { color: var(--code-operator); }
.cm-s-obsidian span.cm-property { color: var(--code-property); }
.cm-s-obsidian span.cm-meta { color: var(--code-keyword); }
.cm-s-obsidian span.cm-def { color: var(--code-function); }
.cm-s-obsidian span.cm-variable { color: var(--text-normal); }
.cm-s-obsidian span.cm-builtin { color: var(--code-value); }
`;

const manifest = {
    name: "Makinda",
    version: palette.version || "1.0.1",
    minAppVersion: "1.0.0",
    author: "Jackson Makinda",
    authorUrl: "https://github.com/makindajack/makinda-themes",
    description:
        "Premium Light + Dark theme with warm orange accents. Auto-switches with system appearance.",
};

console.log("Building Obsidian theme\u2026");
writeOut("ports/obsidian/theme.css", css);
writeOut("ports/obsidian/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
