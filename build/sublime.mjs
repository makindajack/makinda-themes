#!/usr/bin/env node
/**
 * Sublime Text color scheme port.
 *
 * Generates `.sublime-color-scheme` files (JSON) for both variants directly
 * from source/palette.json. Schema reference:
 *   https://www.sublimetext.com/docs/color_schemes.html
 *
 * Output:
 *   ports/sublime/Makinda Light.sublime-color-scheme
 *   ports/sublime/Makinda Dark.sublime-color-scheme
 *
 * Static Package Control files (messages.json, messages/install.txt,
 * package.json, README.md) live next to these and are not regenerated.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;

    return {
        name: label,
        author: "Jackson Makinda",
        variables: {
            brand: c("brand.primary"),
            brandHover: c("brand.primaryHover"),
            accent: c("brand.accent"),
            bg: c("bg.editor"),
            bgElevated1: c("bg.elevated1"),
            bgElevated2: c("bg.elevated2"),
            bgElevated3: c("bg.elevated3"),
            fg: c("fg.default"),
            fgMuted: c("fg.muted"),
            fgSubtle: c("fg.subtle"),
            fgDisabled: c("fg.disabled"),
            border: c("border.default"),
            borderStrong: c("border.strong"),
            kw: c("syntax.keyword"),
            fn: c("syntax.function"),
            type: c("syntax.type"),
            ns: c("syntax.namespace"),
            constant: c("syntax.constant"),
            number: c("syntax.number"),
            string: c("syntax.string"),
            stringEscape: c("syntax.stringEscape"),
            regex: c("syntax.regex"),
            comment: c("syntax.comment"),
            variable: c("syntax.variable"),
            parameter: c("syntax.parameter"),
            languageVariable: c("syntax.languageVariable"),
            operator: c("syntax.operator"),
            punctuation: c("syntax.punctuation"),
            tag: c("syntax.tag"),
            attribute: c("syntax.attribute"),
            decorator: c("syntax.decorator"),
            markupHeading: c("syntax.markupHeading"),
            markupLink: c("syntax.markupLink"),
            markupCode: c("syntax.markupCode"),
            markupQuote: c("syntax.markupQuote"),
            error: c("state.error"),
            warning: c("state.warning"),
            info: c("state.info"),
            success: c("state.success"),
            diffAdded: c("diff.addedFg"),
            diffRemoved: c("diff.removedFg"),
            diffChanged: c("diff.changedFg"),
        },
        globals: {
            background: "var(bg)",
            foreground: "var(fg)",
            caret: c("brand.primary"),
            block_caret: c("brand.primary"),
            line_highlight: c("bg.elevated1"),
            misspelling: c("state.error"),
            fold_marker: "var(brand)",
            accent: "var(brand)",
            selection: c("brand.selectionAlpha"),
            selection_foreground: "var(fg)",
            selection_border: c("border.subtle"),
            inactive_selection: c("bg.elevated1"),
            inactive_selection_foreground: "var(fg)",
            highlight: c("brand.primaryHover"),
            find_highlight: c("brand.selectionAlpha"),
            find_highlight_foreground: "var(fg)",
            guide: c("border.subtle"),
            active_guide: c("border.strong"),
            stack_guide: c("border.default"),
            gutter: "var(bg)",
            gutter_foreground: c("fg.disabled"),
            line_diff_added: "var(diffAdded)",
            line_diff_modified: "var(diffChanged)",
            line_diff_deleted: "var(diffRemoved)",
            shadow: c("shadow.widget"),
            popup_css: ".error { color: var(error); } .warning { color: var(warning); }",
        },
        rules: [
            { name: "Comment", scope: "comment, punctuation.definition.comment", foreground: "var(comment)", font_style: "italic" },
            { name: "String", scope: "string", foreground: "var(string)" },
            { name: "String escape", scope: "constant.character.escape, string source.escape", foreground: "var(stringEscape)" },
            { name: "String regex", scope: "string.regexp, string.regex", foreground: "var(regex)" },
            { name: "Number", scope: "constant.numeric", foreground: "var(number)" },
            { name: "Boolean / null", scope: "constant.language", foreground: "var(constant)" },
            { name: "Constant", scope: "constant.other, support.constant", foreground: "var(constant)" },
            { name: "Keyword", scope: "keyword, keyword.control", foreground: "var(kw)" },
            { name: "Storage", scope: "storage, storage.type, storage.modifier", foreground: "var(kw)" },
            { name: "Operator", scope: "keyword.operator", foreground: "var(operator)" },
            { name: "Punctuation", scope: "punctuation, meta.brace, meta.delimiter", foreground: "var(punctuation)" },
            { name: "Function", scope: "entity.name.function, support.function, meta.function-call", foreground: "var(fn)" },
            { name: "Method", scope: "meta.function-call.method, variable.function", foreground: "var(fn)" },
            { name: "Class / type", scope: "entity.name.class, entity.name.type, support.class, support.type", foreground: "var(type)" },
            { name: "Interface", scope: "entity.name.interface, entity.other.inherited-class", foreground: "var(type)" },
            { name: "Enum", scope: "entity.name.enum", foreground: "var(type)" },
            { name: "Namespace", scope: "entity.name.namespace, entity.name.module, entity.name.package", foreground: "var(ns)" },
            { name: "Variable", scope: "variable, variable.other", foreground: "var(variable)" },
            { name: "Variable parameter", scope: "variable.parameter", foreground: "var(parameter)", font_style: "italic" },
            { name: "Variable language", scope: "variable.language", foreground: "var(languageVariable)", font_style: "italic" },
            { name: "Variable constant", scope: "variable.other.constant", foreground: "var(fn)" },
            { name: "Property", scope: "variable.other.property, meta.property-name, support.type.property-name", foreground: "var(variable)" },
            { name: "HTML/XML tag", scope: "entity.name.tag", foreground: "var(tag)" },
            { name: "HTML/XML attribute", scope: "entity.other.attribute-name", foreground: "var(attribute)" },
            { name: "Decorator", scope: "meta.decorator, meta.annotation, punctuation.definition.annotation", foreground: "var(decorator)" },
            { name: "Decorator name", scope: "meta.decorator entity.name.function, meta.decorator variable", foreground: "var(decorator)" },
            { name: "Import", scope: "keyword.control.import, keyword.control.from, keyword.other.import", foreground: "var(kw)" },
            { name: "This / self", scope: "variable.language.this, variable.language.self, variable.language.super", foreground: "var(languageVariable)", font_style: "italic" },
            { name: "Markup heading", scope: "markup.heading, entity.name.section", foreground: "var(markupHeading)", font_style: "bold" },
            { name: "Markup bold", scope: "markup.bold", foreground: "var(markupHeading)", font_style: "bold" },
            { name: "Markup italic", scope: "markup.italic", foreground: "var(kw)", font_style: "italic" },
            { name: "Markup link", scope: "markup.underline.link, string.other.link", foreground: "var(markupLink)" },
            { name: "Markup code", scope: "markup.raw, markup.inline.raw", foreground: "var(markupCode)" },
            { name: "Markup quote", scope: "markup.quote", foreground: "var(markupQuote)", font_style: "italic" },
            { name: "Markup list", scope: "markup.list, punctuation.definition.list_item", foreground: "var(markupHeading)" },
            { name: "Diff added", scope: "markup.inserted", foreground: "var(diffAdded)" },
            { name: "Diff removed", scope: "markup.deleted", foreground: "var(diffRemoved)" },
            { name: "Diff changed", scope: "markup.changed", foreground: "var(diffChanged)" },
            { name: "Diff header", scope: "meta.diff.header", foreground: "var(fn)" },
            { name: "Invalid", scope: "invalid, invalid.illegal", foreground: c("fg.inverse"), background: "var(error)" },
            { name: "Deprecated", scope: "invalid.deprecated", foreground: "var(fgDisabled)" },
            { name: "JSON key", scope: "support.type.property-name.json, meta.mapping.key string", foreground: "var(variable)" },
            { name: "YAML key", scope: "entity.name.tag.yaml, meta.mapping.key.yaml string", foreground: "var(variable)" },
            { name: "TOML key", scope: "entity.name.tag.toml, support.type.property-name.toml", foreground: "var(variable)" },
            { name: "CSS property", scope: "support.type.property-name.css", foreground: "var(variable)" },
            { name: "CSS value", scope: "meta.property-value.css, support.constant.property-value.css", foreground: "var(constant)" },
            { name: "CSS units", scope: "keyword.other.unit", foreground: "var(number)" },
            { name: "CSS selector", scope: "entity.other.attribute-name.class.css, entity.other.attribute-name.id.css, entity.name.tag.css", foreground: "var(tag)" },
            { name: "Shell variable", scope: "variable.other.readwrite, variable.other.shell", foreground: "var(variable)" },
            { name: "Punctuation accent", scope: "punctuation.definition.template-expression, punctuation.section.embedded", foreground: "var(kw)" },
        ],
    };
}

console.log("Building Sublime Text color schemes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    const json = JSON.stringify(build(v), null, 2) + "\n";
    writeOut(`ports/sublime/Makinda ${label}.sublime-color-scheme`, json);
}
