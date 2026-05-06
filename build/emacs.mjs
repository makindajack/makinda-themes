#!/usr/bin/env node
/**
 * Generate Emacs theme files from source/palette.json.
 * Output:
 *   ports/emacs/makinda-light-theme.el
 *   ports/emacs/makinda-dark-theme.el
 *
 * Each file defines a single deftheme via `deftheme` + `custom-theme-set-faces`,
 * covering core Emacs faces, font-lock, line numbers, mode-line, region,
 * isearch, hl-line, diff/ediff, magit, company/corfu, and flycheck/flymake.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();
const stripAlpha = (h) => "#" + h.replace("#", "").slice(0, 6).toLowerCase();

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const themeName = `makinda-${variant}`;
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;

    const p = {
        bg: stripAlpha(c("bg.editor")),
        bg_elev1: stripAlpha(c("bg.elevated1")),
        bg_elev2: stripAlpha(c("bg.elevated2")),
        bg_elev3: stripAlpha(c("bg.elevated3")),
        bg_menu: stripAlpha(c("bg.menu")),
        bg_panel: stripAlpha(c("bg.panel")),
        fg: stripAlpha(c("fg.default")),
        fg_secondary: stripAlpha(c("fg.secondary")),
        fg_muted: stripAlpha(c("fg.muted")),
        fg_subtle: stripAlpha(c("fg.subtle")),
        fg_disabled: stripAlpha(c("fg.disabled")),
        fg_inverse: stripAlpha(c("fg.inverse")),
        border: stripAlpha(c("border.default")),
        border_strong: stripAlpha(c("border.strong")),
        primary: stripAlpha(c("brand.primary")),
        primary_hover: stripAlpha(c("brand.primaryHover")),
        kw: stripAlpha(c("syntax.keyword")),
        fn: stripAlpha(c("syntax.function")),
        type: stripAlpha(c("syntax.type")),
        ns: stripAlpha(c("syntax.namespace")),
        constant: stripAlpha(c("syntax.constant")),
        number: stripAlpha(c("syntax.number")),
        string: stripAlpha(c("syntax.string")),
        string_escape: stripAlpha(c("syntax.stringEscape")),
        regex: stripAlpha(c("syntax.regex")),
        comment: stripAlpha(c("syntax.comment")),
        variable: stripAlpha(c("syntax.variable")),
        parameter: stripAlpha(c("syntax.parameter")),
        operator: stripAlpha(c("syntax.operator")),
        punctuation: stripAlpha(c("syntax.punctuation")),
        tag: stripAlpha(c("syntax.tag")),
        attribute: stripAlpha(c("syntax.attribute")),
        decorator: stripAlpha(c("syntax.decorator")),
        markup_heading: stripAlpha(c("syntax.markupHeading")),
        markup_link: stripAlpha(c("syntax.markupLink")),
        markup_code: stripAlpha(c("syntax.markupCode")),
        markup_quote: stripAlpha(c("syntax.markupQuote")),
        error: stripAlpha(c("state.error")),
        warning: stripAlpha(c("state.warning")),
        info: stripAlpha(c("state.info")),
        success: stripAlpha(c("state.success")),
        diff_added: stripAlpha(c("diff.addedFg")),
        diff_changed: stripAlpha(c("diff.changedFg")),
        diff_removed: stripAlpha(c("diff.removedFg")),
    };

    const F = (face, attrs) => `   '(${face} ((t ${attrs})))`;

    const faces = [
        F("default", `(:foreground "${p.fg}" :background "${p.bg}")`),
        F("cursor", `(:background "${p.primary}")`),
        F("region", `(:background "${p.bg_elev2}" :extend t)`),
        F("highlight", `(:background "${p.bg_elev1}")`),
        F("hl-line", `(:background "${p.bg_elev1}" :extend t)`),
        F("fringe", `(:background "${p.bg}")`),
        F("vertical-border", `(:foreground "${p.border}")`),
        F("window-divider", `(:foreground "${p.border}")`),
        F("window-divider-first-pixel", `(:foreground "${p.border}")`),
        F("window-divider-last-pixel", `(:foreground "${p.border}")`),
        F("minibuffer-prompt", `(:foreground "${p.primary}" :weight bold)`),
        F("link", `(:foreground "${p.markup_link}" :underline t)`),
        F("link-visited", `(:foreground "${p.markup_link}" :underline t)`),
        F("button", `(:foreground "${p.fg_inverse}" :background "${p.primary}" :weight bold :box (:line-width -1 :color "${p.primary}"))`),
        F("trailing-whitespace", `(:background "${p.bg_elev2}")`),
        F("show-paren-match", `(:foreground "${p.primary}" :weight bold :underline t)`),
        F("show-paren-mismatch", `(:foreground "${p.fg_inverse}" :background "${p.error}")`),
        F("isearch", `(:foreground "${p.fg_inverse}" :background "${p.primary}")`),
        F("isearch-fail", `(:foreground "${p.fg_inverse}" :background "${p.error}")`),
        F("lazy-highlight", `(:background "${p.bg_elev2}")`),
        F("match", `(:foreground "${p.primary}" :weight bold)`),

        F("mode-line", `(:foreground "${p.fg}" :background "${p.bg_elev1}" :box (:line-width -1 :color "${p.border}"))`),
        F("mode-line-inactive", `(:foreground "${p.fg_muted}" :background "${p.bg}" :box (:line-width -1 :color "${p.border}"))`),
        F("mode-line-emphasis", `(:foreground "${p.primary}" :weight bold)`),
        F("mode-line-highlight", `(:foreground "${p.primary}")`),
        F("header-line", `(:foreground "${p.fg}" :background "${p.bg_elev1}")`),

        F("line-number", `(:foreground "${p.fg_disabled}" :background "${p.bg}")`),
        F("line-number-current-line", `(:foreground "${p.primary}" :background "${p.bg_elev1}" :weight bold)`),
        F("line-number-major-tick", `(:foreground "${p.fg_muted}")`),
        F("line-number-minor-tick", `(:foreground "${p.fg_disabled}")`),

        F("font-lock-comment-face", `(:foreground "${p.comment}" :slant italic)`),
        F("font-lock-comment-delimiter-face", `(:foreground "${p.comment}" :slant italic)`),
        F("font-lock-doc-face", `(:foreground "${p.comment}" :slant italic)`),
        F("font-lock-string-face", `(:foreground "${p.string}")`),
        F("font-lock-keyword-face", `(:foreground "${p.kw}")`),
        F("font-lock-builtin-face", `(:foreground "${p.constant}")`),
        F("font-lock-constant-face", `(:foreground "${p.constant}")`),
        F("font-lock-function-name-face", `(:foreground "${p.fn}")`),
        F("font-lock-variable-name-face", `(:foreground "${p.variable}")`),
        F("font-lock-type-face", `(:foreground "${p.type}")`),
        F("font-lock-warning-face", `(:foreground "${p.warning}" :weight bold)`),
        F("font-lock-preprocessor-face", `(:foreground "${p.decorator}")`),
        F("font-lock-negation-char-face", `(:foreground "${p.kw}")`),
        F("font-lock-regexp-grouping-backslash", `(:foreground "${p.string_escape}")`),
        F("font-lock-regexp-grouping-construct", `(:foreground "${p.regex}")`),

        F("error", `(:foreground "${p.error}" :weight bold)`),
        F("warning", `(:foreground "${p.warning}")`),
        F("success", `(:foreground "${p.success}")`),

        // tree-sitter / treesit-fontify
        F("font-lock-property-name-face", `(:foreground "${p.variable}")`),
        F("font-lock-property-use-face", `(:foreground "${p.variable}")`),
        F("font-lock-operator-face", `(:foreground "${p.operator}")`),
        F("font-lock-bracket-face", `(:foreground "${p.punctuation}")`),
        F("font-lock-delimiter-face", `(:foreground "${p.punctuation}")`),
        F("font-lock-number-face", `(:foreground "${p.number}")`),
        F("font-lock-misc-punctuation-face", `(:foreground "${p.punctuation}")`),
        F("font-lock-punctuation-face", `(:foreground "${p.punctuation}")`),
        F("font-lock-escape-face", `(:foreground "${p.string_escape}")`),
        F("font-lock-function-call-face", `(:foreground "${p.fn}")`),
        F("font-lock-function-name-face", `(:foreground "${p.fn}")`),
        F("font-lock-variable-use-face", `(:foreground "${p.variable}")`),

        // diff
        F("diff-added", `(:foreground "${p.diff_added}" :background "${p.bg_elev1}" :extend t)`),
        F("diff-removed", `(:foreground "${p.diff_removed}" :background "${p.bg_elev1}" :extend t)`),
        F("diff-changed", `(:foreground "${p.diff_changed}" :background "${p.bg_elev1}" :extend t)`),
        F("diff-refine-added", `(:background "${p.bg_elev2}" :foreground "${p.diff_added}" :weight bold)`),
        F("diff-refine-removed", `(:background "${p.bg_elev2}" :foreground "${p.diff_removed}" :weight bold)`),
        F("diff-refine-changed", `(:background "${p.bg_elev2}" :foreground "${p.diff_changed}" :weight bold)`),
        F("diff-header", `(:foreground "${p.fn}" :weight bold)`),
        F("diff-file-header", `(:foreground "${p.markup_heading}" :weight bold)`),

        // ediff
        F("ediff-current-diff-A", `(:background "${p.bg_elev1}")`),
        F("ediff-current-diff-B", `(:background "${p.bg_elev1}")`),
        F("ediff-current-diff-C", `(:background "${p.bg_elev1}")`),
        F("ediff-fine-diff-A", `(:background "${p.bg_elev2}" :weight bold)`),
        F("ediff-fine-diff-B", `(:background "${p.bg_elev2}" :weight bold)`),
        F("ediff-fine-diff-C", `(:background "${p.bg_elev2}" :weight bold)`),

        // magit
        F("magit-section-heading", `(:foreground "${p.markup_heading}" :weight bold)`),
        F("magit-section-highlight", `(:background "${p.bg_elev1}" :extend t)`),
        F("magit-diff-added", `(:foreground "${p.diff_added}" :background "${p.bg_elev1}" :extend t)`),
        F("magit-diff-added-highlight", `(:foreground "${p.diff_added}" :background "${p.bg_elev2}" :extend t)`),
        F("magit-diff-removed", `(:foreground "${p.diff_removed}" :background "${p.bg_elev1}" :extend t)`),
        F("magit-diff-removed-highlight", `(:foreground "${p.diff_removed}" :background "${p.bg_elev2}" :extend t)`),
        F("magit-diff-context", `(:foreground "${p.fg_muted}" :background "${p.bg}" :extend t)`),
        F("magit-diff-context-highlight", `(:foreground "${p.fg_muted}" :background "${p.bg_elev1}" :extend t)`),
        F("magit-diff-hunk-heading", `(:foreground "${p.fg}" :background "${p.bg_elev1}" :extend t)`),
        F("magit-diff-hunk-heading-highlight", `(:foreground "${p.fg}" :background "${p.bg_elev2}" :extend t)`),
        F("magit-branch-local", `(:foreground "${p.primary}")`),
        F("magit-branch-remote", `(:foreground "${p.success}")`),
        F("magit-tag", `(:foreground "${p.constant}")`),
        F("magit-hash", `(:foreground "${p.fg_muted}")`),

        // company / corfu
        F("company-tooltip", `(:foreground "${p.fg}" :background "${p.bg_menu}")`),
        F("company-tooltip-selection", `(:foreground "${p.fg}" :background "${p.bg_elev2}" :weight bold)`),
        F("company-tooltip-common", `(:foreground "${p.primary}" :weight bold)`),
        F("company-tooltip-annotation", `(:foreground "${p.fg_muted}")`),
        F("company-scrollbar-bg", `(:background "${p.bg_menu}")`),
        F("company-scrollbar-fg", `(:background "${p.border_strong}")`),
        F("corfu-default", `(:foreground "${p.fg}" :background "${p.bg_menu}")`),
        F("corfu-current", `(:foreground "${p.fg}" :background "${p.bg_elev2}")`),
        F("corfu-bar", `(:background "${p.border_strong}")`),
        F("corfu-border", `(:background "${p.border}")`),

        // flycheck / flymake
        F("flycheck-error", `(:underline (:color "${p.error}" :style wave))`),
        F("flycheck-warning", `(:underline (:color "${p.warning}" :style wave))`),
        F("flycheck-info", `(:underline (:color "${p.info}" :style wave))`),
        F("flymake-error", `(:underline (:color "${p.error}" :style wave))`),
        F("flymake-warning", `(:underline (:color "${p.warning}" :style wave))`),
        F("flymake-note", `(:underline (:color "${p.info}" :style wave))`),

        // org-mode
        F("org-level-1", `(:foreground "${p.markup_heading}" :weight bold)`),
        F("org-level-2", `(:foreground "${p.markup_heading}" :weight bold)`),
        F("org-level-3", `(:foreground "${p.markup_heading}" :weight bold)`),
        F("org-level-4", `(:foreground "${p.markup_heading}" :weight bold)`),
        F("org-level-5", `(:foreground "${p.markup_heading}")`),
        F("org-level-6", `(:foreground "${p.markup_heading}")`),
        F("org-block", `(:background "${p.bg_elev1}" :extend t)`),
        F("org-code", `(:foreground "${p.markup_code}")`),
        F("org-verbatim", `(:foreground "${p.markup_code}")`),
        F("org-quote", `(:foreground "${p.markup_quote}" :slant italic)`),
        F("org-todo", `(:foreground "${p.warning}" :weight bold)`),
        F("org-done", `(:foreground "${p.success}" :weight bold)`),
        F("org-link", `(:foreground "${p.markup_link}" :underline t)`),
        F("org-table", `(:foreground "${p.fg}" :background "${p.bg_elev1}")`),
    ];

    return `;;; ${themeName}-theme.el --- ${label} theme  -*- lexical-binding: t; -*-
;;
;; Author: Jackson Makinda
;; URL: https://github.com/makindajack/makinda-themes
;; Generated from source/palette.json. Do not edit by hand.
;;
;;; Commentary:
;;
;; ${label} \u2014 a premium ${variant} theme with warm orange accents.
;;
;;; Code:

(deftheme ${themeName}
  "${label} \u2014 premium ${variant} theme with warm orange accents.")

(custom-theme-set-faces
 '${themeName}
${faces.join("\n")})

(custom-theme-set-variables
 '${themeName}
 '(frame-background-mode (quote ${isDark ? "dark" : "light"})))

;;;###autoload
(when (and (boundp 'custom-theme-load-path) load-file-name)
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory
                (file-name-directory load-file-name))))

(provide-theme '${themeName})
;;; ${themeName}-theme.el ends here
`;
}

console.log("Building Emacs themes\u2026");
for (const v of VARIANTS) {
    writeOut(`ports/emacs/makinda-${v}-theme.el`, build(v));
}
