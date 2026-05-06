#!/usr/bin/env node
/**
 * Generate a Notepad++ user-defined "stylers.xml"-compatible theme file from
 * source/palette.json.
 *
 * Output:
 *   ports/notepad-plus-plus/Makinda Light.xml
 *   ports/notepad-plus-plus/Makinda Dark.xml
 *
 * Notepad++ themes follow `userDefineLang` / `LexerStyles` / `GlobalStyles`
 * structure under a top-level <NotepadPlus> root. We emit GlobalStyles plus
 * a representative LexerStyles set covering common languages
 * (cpp, java, python, javascript, html, xml, css, json, sql, markdown).
 *
 * Colors are 6-digit hex without "#". Notepad++ uses "fontStyle" bitmask:
 *   0=normal, 1=bold, 2=italic, 4=underline.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

const hex6 = (h) => h.replace("#", "").slice(0, 6).toUpperCase();

function gs(name, fg, bg, fontStyle = 0) {
    return `        <WidgetStyle name="${name}" styleID="0" fgColor="${hex6(fg)}" bgColor="${hex6(bg)}" fontStyle="${fontStyle}" />`;
}

function ws(name, styleID, fg, bg, fontStyle = 0) {
    return `            <WordsStyle name="${name}" styleID="${styleID}" fgColor="${hex6(fg)}" bgColor="${hex6(bg)}" fontStyle="${fontStyle}" />`;
}

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;
    const bg = c("bg.editor");
    const bg1 = c("bg.elevated1");
    const bg2 = c("bg.elevated2");
    const fg = c("fg.default");

    const tokens = {
        kw: c("syntax.keyword"),
        fn: c("syntax.function"),
        type: c("syntax.type"),
        constant: c("syntax.constant"),
        number: c("syntax.number"),
        string: c("syntax.string"),
        string_escape: c("syntax.stringEscape"),
        regex: c("syntax.regex"),
        comment: c("syntax.comment"),
        operator: c("syntax.operator"),
        punctuation: c("syntax.punctuation"),
        tag: c("syntax.tag"),
        attribute: c("syntax.attribute"),
        decorator: c("syntax.decorator"),
        markup_heading: c("syntax.markupHeading"),
        markup_link: c("syntax.markupLink"),
        markup_code: c("syntax.markupCode"),
    };

    // Notepad++ Scintilla style IDs are lexer-specific. We pick the most common
    // canonical IDs per lexer. Italic = 2 for comments.
    const lexers = {
        cpp: [
            ["DEFAULT", 0, fg, bg, 0],
            ["COMMENT", 1, tokens.comment, bg, 2],
            ["COMMENT LINE", 2, tokens.comment, bg, 2],
            ["COMMENT DOC", 3, tokens.comment, bg, 2],
            ["NUMBER", 4, tokens.number, bg, 0],
            ["INSTRUCTION WORD", 5, tokens.kw, bg, 0],
            ["STRING", 6, tokens.string, bg, 0],
            ["CHARACTER", 7, tokens.string, bg, 0],
            ["OPERATOR", 10, tokens.operator, bg, 0],
            ["IDENTIFIER", 11, fg, bg, 0],
            ["TYPE WORD", 16, tokens.type, bg, 0],
            ["PREPROCESSOR", 9, tokens.decorator, bg, 0],
        ],
        java: [
            ["DEFAULT", 0, fg, bg, 0],
            ["COMMENT", 1, tokens.comment, bg, 2],
            ["COMMENT LINE", 2, tokens.comment, bg, 2],
            ["NUMBER", 4, tokens.number, bg, 0],
            ["KEYWORD", 5, tokens.kw, bg, 0],
            ["STRING", 6, tokens.string, bg, 0],
            ["TYPE", 16, tokens.type, bg, 0],
            ["OPERATOR", 10, tokens.operator, bg, 0],
        ],
        python: [
            ["DEFAULT", 0, fg, bg, 0],
            ["COMMENT LINE", 1, tokens.comment, bg, 2],
            ["NUMBER", 2, tokens.number, bg, 0],
            ["STRING", 3, tokens.string, bg, 0],
            ["CHARACTER", 4, tokens.string, bg, 0],
            ["KEYWORD", 5, tokens.kw, bg, 0],
            ["TRIPLE STRING", 6, tokens.string, bg, 0],
            ["TRIPLE DOUBLE STR", 7, tokens.string, bg, 0],
            ["CLASSNAME", 8, tokens.type, bg, 0],
            ["DEFNAME", 9, tokens.fn, bg, 0],
            ["OPERATOR", 10, tokens.operator, bg, 0],
            ["IDENTIFIER", 11, fg, bg, 0],
            ["DECORATOR", 15, tokens.decorator, bg, 0],
        ],
        javascript: [
            ["DEFAULT", 0, fg, bg, 0],
            ["COMMENT", 1, tokens.comment, bg, 2],
            ["COMMENT LINE", 2, tokens.comment, bg, 2],
            ["COMMENT DOC", 3, tokens.comment, bg, 2],
            ["NUMBER", 4, tokens.number, bg, 0],
            ["KEYWORD", 5, tokens.kw, bg, 0],
            ["STRING", 6, tokens.string, bg, 0],
            ["REGEX", 14, tokens.regex, bg, 0],
            ["OPERATOR", 10, tokens.operator, bg, 0],
            ["IDENTIFIER", 11, fg, bg, 0],
        ],
        html: [
            ["DEFAULT", 0, fg, bg, 0],
            ["TAG", 1, tokens.tag, bg, 0],
            ["TAG UNKNOWN", 2, tokens.tag, bg, 0],
            ["ATTRIBUTE", 3, tokens.attribute, bg, 0],
            ["ATTRIBUTE UNKNOWN", 4, tokens.attribute, bg, 0],
            ["NUMBER", 5, tokens.number, bg, 0],
            ["DOUBLESTRING", 6, tokens.string, bg, 0],
            ["SINGLESTRING", 7, tokens.string, bg, 0],
            ["OTHER", 8, fg, bg, 0],
            ["COMMENT", 9, tokens.comment, bg, 2],
            ["ENTITY", 10, tokens.string_escape, bg, 0],
        ],
        css: [
            ["DEFAULT", 0, fg, bg, 0],
            ["TAG", 1, tokens.tag, bg, 0],
            ["CLASS", 2, tokens.attribute, bg, 0],
            ["PSEUDOCLASS", 3, tokens.decorator, bg, 0],
            ["IDENTIFIER", 5, fg, bg, 0],
            ["OPERATOR", 6, tokens.operator, bg, 0],
            ["STRING", 8, tokens.string, bg, 0],
            ["COMMENT", 9, tokens.comment, bg, 2],
            ["VALUE", 11, tokens.constant, bg, 0],
            ["IMPORTANT", 12, tokens.kw, bg, 1],
        ],
        json: [
            ["DEFAULT", 0, fg, bg, 0],
            ["STRING", 1, tokens.string, bg, 0],
            ["NUMBER", 2, tokens.number, bg, 0],
            ["KEYWORD", 3, tokens.constant, bg, 0],
            ["OPERATOR", 4, tokens.operator, bg, 0],
            ["URL", 5, tokens.markup_link, bg, 0],
            ["PROPERTYNAME", 8, fg, bg, 0],
            ["LINECOMMENT", 9, tokens.comment, bg, 2],
            ["BLOCKCOMMENT", 10, tokens.comment, bg, 2],
        ],
        sql: [
            ["DEFAULT", 0, fg, bg, 0],
            ["COMMENT", 1, tokens.comment, bg, 2],
            ["LINE COMMENT", 2, tokens.comment, bg, 2],
            ["NUMBER", 4, tokens.number, bg, 0],
            ["KEYWORD", 5, tokens.kw, bg, 0],
            ["STRING", 6, tokens.string, bg, 0],
            ["OPERATOR", 7, tokens.operator, bg, 0],
            ["IDENTIFIER", 11, fg, bg, 0],
        ],
        markdown: [
            ["DEFAULT", 0, fg, bg, 0],
            ["HEADER 1", 1, tokens.markup_heading, bg, 1],
            ["HEADER 2", 2, tokens.markup_heading, bg, 1],
            ["HEADER 3", 3, tokens.markup_heading, bg, 1],
            ["EMPHASIS", 6, tokens.kw, bg, 2],
            ["STRONG", 7, tokens.markup_heading, bg, 1],
            ["BLOCKQUOTE", 11, tokens.comment, bg, 2],
            ["LINK", 17, tokens.markup_link, bg, 4],
            ["CODE", 12, tokens.markup_code, bg1, 0],
            ["CODEBK", 13, tokens.markup_code, bg1, 0],
        ],
    };

    const lexerBlocks = Object.entries(lexers).map(([lex, styles]) => {
        const lines = [`        <LexerType name="${lex}" desc="${lex}" ext="">`];
        for (const [name, id, fg2, bg2, fs] of styles) {
            lines.push(ws(name, id, fg2, bg2, fs));
        }
        lines.push("        </LexerType>");
        return lines.join("\n");
    });

    return `<?xml version="1.0" encoding="UTF-8" ?>
<!-- ${label} \u2014 Notepad++ theme. Generated from source/palette.json. -->
<NotepadPlus>
    <GlobalStyles>
${gs("Global override", fg, bg)}
${gs("Default Style", fg, bg)}
${gs("Indent guideline style", c("border.subtle"), bg)}
${gs("Brace highlight style", c("brand.primary"), bg, 1)}
${gs("Bad brace colour", c("state.error"), bg, 1)}
${gs("Current line background colour", fg, bg1)}
${gs("Selected text colour", fg, bg2)}
${gs("Caret colour", c("brand.primary"), bg)}
${gs("Edge colour", c("border.default"), bg)}
${gs("Line number margin", c("fg.disabled"), bg)}
${gs("Bookmark margin", c("fg.muted"), bg1)}
${gs("Fold", c("fg.muted"), bg)}
${gs("Fold active", c("brand.primary"), bg)}
${gs("Fold margin", c("border.subtle"), bg)}
${gs("White space symbol", c("fg.disabled"), bg)}
${gs("Mark Style 1", c("fg.inverse"), c("state.error"))}
${gs("Mark Style 2", c("fg.inverse"), c("state.warning"))}
${gs("Mark Style 3", c("fg.inverse"), c("brand.primary"))}
${gs("Mark Style 4", c("fg.inverse"), c("state.success"))}
${gs("Mark Style 5", c("fg.inverse"), c("state.info"))}
${gs("Find Mark Style", c("fg.inverse"), c("brand.primary"))}
${gs("Smart Highlighting", fg, bg2)}
${gs("Tags match highlighting", c("brand.primary"), bg2, 1)}
${gs("Tags attribute", c("syntax.attribute"), bg, 0)}
${gs("URL hovered", c("syntax.markupLink"), bg, 4)}
    </GlobalStyles>
    <LexerStyles>
${lexerBlocks.join("\n")}
    </LexerStyles>
</NotepadPlus>
`;
}

console.log("Building Notepad++ themes\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/notepad-plus-plus/Makinda ${label}.xml`, build(v));
}
