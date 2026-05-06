#!/usr/bin/env node
/**
 * Generate Eclipse `.epf` (Eclipse Preference File) exports from source/palette.json.
 * Output:
 *   ports/eclipse/makinda-light.epf
 *   ports/eclipse/makinda-dark.epf
 *
 * Eclipse colors are stored as comma-separated R,G,B integers.
 * Import via: Window → Preferences → "Import…" → choose this file.
 *
 * Covers: editor surface (text/background/line numbers), Java/JDT syntax,
 * XML, and console.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function rgb(hex) {
    const h = hex.replace("#", "").slice(0, 6);
    return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

const esc = (s) => s.replace(/=/g, "\\=").replace(/:/g, "\\:");

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const themeId = `makinda-${variant}`;

    const lines = [
        `# Makinda ${isDark ? "Dark" : "Light"} \u2014 Eclipse preference export`,
        `# Generated from source/palette.json. Do not edit by hand.`,
        `file_export_version=3.0`,
        `\\!@*~/${themeId}=`,
        // Workbench / general
        `/instance/org.eclipse.ui.workbench/AUTOGEN_EDITED_BY_USER=true`,
        // Editor colors (org.eclipse.ui.editors)
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Background=${rgb(c("bg.editor"))}`,
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Background.SystemDefault=false`,
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Foreground=${rgb(c("fg.default"))}`,
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Foreground.SystemDefault=false`,
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.SelectionBackground=${rgb(c("bg.elevated2"))}`,
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.SelectionBackground.SystemDefault=false`,
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.SelectionForeground=${rgb(c("fg.default"))}`,
        `/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.SelectionForeground.SystemDefault=false`,
        `/instance/org.eclipse.ui.editors/lineNumberColor=${rgb(c("fg.disabled"))}`,
        `/instance/org.eclipse.ui.editors/currentLineColor=${rgb(c("bg.elevated1"))}`,
        `/instance/org.eclipse.ui.editors/printMarginColor=${rgb(c("border.subtle"))}`,
        // JDT syntax
        `/instance/org.eclipse.jdt.ui/java_keyword=${rgb(c("syntax.keyword"))}`,
        `/instance/org.eclipse.jdt.ui/java_keyword_bold=true`,
        `/instance/org.eclipse.jdt.ui/java_string=${rgb(c("syntax.string"))}`,
        `/instance/org.eclipse.jdt.ui/java_default=${rgb(c("fg.default"))}`,
        `/instance/org.eclipse.jdt.ui/java_operator=${rgb(c("syntax.operator"))}`,
        `/instance/org.eclipse.jdt.ui/java_bracket=${rgb(c("syntax.punctuation"))}`,
        `/instance/org.eclipse.jdt.ui/java_single_line_comment=${rgb(c("syntax.comment"))}`,
        `/instance/org.eclipse.jdt.ui/java_multi_line_comment=${rgb(c("syntax.comment"))}`,
        `/instance/org.eclipse.jdt.ui/java_doc_comment=${rgb(c("syntax.comment"))}`,
        `/instance/org.eclipse.jdt.ui/java_doc_default=${rgb(c("syntax.comment"))}`,
        `/instance/org.eclipse.jdt.ui/java_doc_keyword=${rgb(c("syntax.decorator"))}`,
        `/instance/org.eclipse.jdt.ui/java_doc_link=${rgb(c("syntax.markupLink"))}`,
        `/instance/org.eclipse.jdt.ui/java_doc_tag=${rgb(c("syntax.tag"))}`,
        `/instance/org.eclipse.jdt.ui/java_annotation=${rgb(c("syntax.decorator"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.method.color=${rgb(c("syntax.function"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.staticMethodInvocation.color=${rgb(c("syntax.function"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.field.color=${rgb(c("syntax.variable"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.staticField.color=${rgb(c("syntax.constant"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.localVariable.color=${rgb(c("syntax.variable"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.parameterVariable.color=${rgb(c("syntax.parameter"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.class.color=${rgb(c("syntax.type"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.interface.color=${rgb(c("syntax.type"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.enum.color=${rgb(c("syntax.type"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.typeParameter.color=${rgb(c("syntax.type"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.number.color=${rgb(c("syntax.number"))}`,
        `/instance/org.eclipse.jdt.ui/semanticHighlighting.deprecatedMember.strikethrough=true`,
        // XML editor
        `/instance/org.eclipse.wst.xml.ui/xmlTagName=${rgb(c("syntax.tag"))} | null | false | false | false | false`,
        `/instance/org.eclipse.wst.xml.ui/xmlAttributeName=${rgb(c("syntax.attribute"))} | null | false | false | false | false`,
        `/instance/org.eclipse.wst.xml.ui/xmlAttributeValue=${rgb(c("syntax.string"))} | null | false | false | false | false`,
        `/instance/org.eclipse.wst.xml.ui/xmlComment=${rgb(c("syntax.comment"))} | null | false | true | false | false`,
        // Console
        `/instance/org.eclipse.debug.ui/Console.background=${rgb(c("bg.panel"))}`,
        `/instance/org.eclipse.debug.ui/Console.outColor=${rgb(c("fg.default"))}`,
        `/instance/org.eclipse.debug.ui/Console.errColor=${rgb(c("state.error"))}`,
        `/instance/org.eclipse.debug.ui/Console.inColor=${rgb(c("syntax.string"))}`,
        ``,
    ];
    return lines.join("\n");
}

console.log("Building Eclipse .epf files\u2026");
for (const v of VARIANTS) {
    writeOut(`ports/eclipse/makinda-${v}.epf`, build(v));
}
