#!/usr/bin/env node
/**
 * Generate a BetterDiscord theme (CSS) from source/palette.json.
 * Output:
 *   ports/discord/Makinda Light.theme.css
 *   ports/discord/Makinda Dark.theme.css
 *
 * Drop into BetterDiscord's themes folder:
 *   %APPDATA%/BetterDiscord/themes/        (Windows)
 *   ~/Library/Application Support/BetterDiscord/themes/  (macOS)
 *   ~/.config/BetterDiscord/themes/        (Linux)
 *
 * Uses Discord's `--background-*`, `--text-*`, `--brand-*` CSS variables.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;

    return `/**
 * @name Makinda ${isDark ? "Dark" : "Light"}
 * @author Jackson Makinda
 * @version ${palette.version || "1.0.1"}
 * @description ${label} \u2014 premium ${variant} Discord theme with warm orange accents.
 * @source https://github.com/makindajack/makinda-themes
 */

:root {
    /* Brand */
    --brand-experiment: ${c("brand.primary")};
    --brand-experiment-100: ${c("brand.primaryHover")};
    --brand-experiment-160: ${c("brand.primary")};
    --brand-experiment-200: ${c("brand.primary")};
    --brand-experiment-260: ${c("brand.primary")};
    --brand-experiment-300: ${c("brand.primary")};
    --brand-experiment-360: ${c("brand.primary")};
    --brand-experiment-400: ${c("brand.primary")};
    --brand-experiment-460: ${c("brand.primary")};
    --brand-experiment-500: ${c("brand.primary")};
    --brand-experiment-560: ${c("brand.primaryHover")};
    --brand-experiment-600: ${c("brand.primaryHover")};
    --brand-experiment-660: ${c("brand.primaryHover")};
    --brand-experiment-700: ${c("brand.primaryHover")};
    --brand-experiment-760: ${c("brand.primaryHover")};
    --brand-experiment-800: ${c("brand.primaryHover")};
    --brand-experiment-860: ${c("brand.primaryHover")};
    --brand-experiment-900: ${c("brand.primaryHover")};

    /* Backgrounds */
    --background-primary: ${c("bg.editor")};
    --background-secondary: ${c("bg.sidebar")};
    --background-secondary-alt: ${c("bg.elevated1")};
    --background-tertiary: ${c("bg.titlebar")};
    --background-accent: ${c("brand.primary")};
    --background-floating: ${c("bg.menu")};
    --background-mentioned: ${c("brand.primary")}22;
    --background-mentioned-hover: ${c("brand.primary")}33;
    --background-message-hover: ${c("bg.elevated1")};
    --background-modifier-hover: ${c("bg.elevated1")};
    --background-modifier-active: ${c("bg.elevated2")};
    --background-modifier-selected: ${c("bg.elevated2")};
    --background-modifier-accent: ${c("border.subtle")};

    /* Text */
    --text-normal: ${c("fg.default")};
    --text-muted: ${c("fg.muted")};
    --text-link: ${c("syntax.markupLink")};
    --text-positive: ${c("state.success")};
    --text-warning: ${c("state.warning")};
    --text-danger: ${c("state.error")};
    --text-brand: ${c("brand.primary")};
    --interactive-normal: ${c("fg.secondary")};
    --interactive-hover: ${c("fg.default")};
    --interactive-active: ${c("brand.primary")};
    --interactive-muted: ${c("fg.disabled")};
    --header-primary: ${c("fg.default")};
    --header-secondary: ${c("fg.secondary")};

    /* Channels list */
    --channels-default: ${c("fg.muted")};
    --channeltextarea-background: ${c("bg.elevated1")};

    /* Status */
    --status-positive-background: ${c("state.success")};
    --status-positive-text: ${c("fg.inverse")};
    --status-warning-background: ${c("state.warning")};
    --status-warning-text: ${c("fg.inverse")};
    --status-danger-background: ${c("state.error")};
    --status-danger-text: ${c("fg.inverse")};

    /* Scrollbars */
    --scrollbar-thin-thumb: ${c("border.strong")};
    --scrollbar-thin-track: transparent;
    --scrollbar-auto-thumb: ${c("border.strong")};
    --scrollbar-auto-track: ${c("bg.editor")};
    --scrollbar-auto-scrollbar-color-thumb: ${c("border.strong")};
    --scrollbar-auto-scrollbar-color-track: ${c("bg.editor")};
}

.theme-${isDark ? "dark" : "light"} {
    --background-primary: ${c("bg.editor")};
    --background-secondary: ${c("bg.sidebar")};
    --background-tertiary: ${c("bg.titlebar")};
    --text-normal: ${c("fg.default")};
}

/* Code blocks */
code,
pre {
    background: ${c("bg.elevated1")} !important;
    color: ${c("syntax.markupCode")} !important;
    border: 1px solid ${c("border.subtle")} !important;
}
`;
}

console.log("Building Discord (BetterDiscord) themes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/discord/Makinda ${label}.theme.css`, build(v));
}
