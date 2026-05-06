#!/usr/bin/env node
/**
 * Neovim & Vim color scheme port.
 *
 * Output layout (standard Neovim plugin):
 *   ports/neovim/colors/makinda-light.lua        ← `:colorscheme makinda-light`
 *   ports/neovim/colors/makinda-dark.lua         ← `:colorscheme makinda-dark`
 *   ports/neovim/colors/makinda-light.vim        ← Vim fallback (cterm + gui)
 *   ports/neovim/colors/makinda-dark.vim         ← Vim fallback
 *   ports/neovim/lua/makinda/init.lua            ← setup({ variant = ... })
 *   ports/neovim/lua/makinda/palette.lua         ← generated palettes
 *   ports/neovim/lua/makinda/highlights.lua      ← highlight groups
 *   ports/neovim/lua/makinda/util.lua            ← apply helper
 *
 * Covers Neovim built-in groups, Treesitter, LSP semantic tokens, diagnostics,
 * gitsigns, telescope, nvim-tree / neo-tree, and lualine.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

// ---------------------------------------------------------------------------
// 256-color (cterm) approximation. Maps a #RRGGBB hex to the nearest xterm-256
// index using a small palette of common ANSI/grayscale anchors. This is a
// fallback only — true-color terminals use the gui colors directly.
// ---------------------------------------------------------------------------
const ANSI_256 = (() => {
    const out = [];
    // 0–15: standard 16 — leave to terminal config; we don't emit those.
    // 16–231: 6×6×6 cube
    const cubeLevels = [0, 95, 135, 175, 215, 255];
    for (let r = 0; r < 6; r++) {
        for (let g = 0; g < 6; g++) {
            for (let b = 0; b < 6; b++) {
                out.push({
                    idx: 16 + 36 * r + 6 * g + b,
                    rgb: [cubeLevels[r], cubeLevels[g], cubeLevels[b]],
                });
            }
        }
    }
    // 232–255: grayscale
    for (let i = 0; i < 24; i++) {
        const v = 8 + i * 10;
        out.push({ idx: 232 + i, rgb: [v, v, v] });
    }
    return out;
})();

function hexToRgb(hex) {
    const h = hex.replace("#", "").slice(0, 6);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function nearestCterm(hex) {
    const [r, g, b] = hexToRgb(hex);
    let best = ANSI_256[0];
    let bestD = Infinity;
    for (const e of ANSI_256) {
        const dr = e.rgb[0] - r, dg = e.rgb[1] - g, db = e.rgb[2] - b;
        const d = dr * dr + dg * dg + db * db;
        if (d < bestD) {
            bestD = d;
            best = e;
        }
    }
    return best.idx;
}
function stripAlpha(hex) {
    return "#" + hex.replace("#", "").slice(0, 6).toLowerCase();
}

// ---------------------------------------------------------------------------
// Lua palette table
// ---------------------------------------------------------------------------
function buildPaletteLua() {
    const out = ["-- Generated from source/palette.json. Do not edit by hand.", "local M = {}", ""];
    for (const variant of VARIANTS) {
        const c = makeResolver(palette, variant);
        const roles = {
            // brand
            primary: c("brand.primary"),
            primary_hover: c("brand.primaryHover"),
            accent: c("brand.accent"),
            selection: c("brand.selectionAlpha"),
            focus: c("brand.focusAlpha"),
            // bg
            bg: c("bg.editor"),
            bg_sidebar: c("bg.sidebar"),
            bg_panel: c("bg.panel"),
            bg_elev1: c("bg.elevated1"),
            bg_elev2: c("bg.elevated2"),
            bg_elev3: c("bg.elevated3"),
            bg_menu: c("bg.menu"),
            bg_input: c("bg.input"),
            // fg
            fg: c("fg.default"),
            fg_secondary: c("fg.secondary"),
            fg_muted: c("fg.muted"),
            fg_subtle: c("fg.subtle"),
            fg_disabled: c("fg.disabled"),
            fg_inverse: c("fg.inverse"),
            // border
            border: c("border.default"),
            border_subtle: c("border.subtle"),
            border_strong: c("border.strong"),
            // syntax
            kw: c("syntax.keyword"),
            fn: c("syntax.function"),
            type: c("syntax.type"),
            namespace: c("syntax.namespace"),
            constant: c("syntax.constant"),
            number: c("syntax.number"),
            string: c("syntax.string"),
            string_escape: c("syntax.stringEscape"),
            regex: c("syntax.regex"),
            comment: c("syntax.comment"),
            variable: c("syntax.variable"),
            parameter: c("syntax.parameter"),
            language_variable: c("syntax.languageVariable"),
            operator: c("syntax.operator"),
            punctuation: c("syntax.punctuation"),
            tag: c("syntax.tag"),
            attribute: c("syntax.attribute"),
            decorator: c("syntax.decorator"),
            markup_heading: c("syntax.markupHeading"),
            markup_link: c("syntax.markupLink"),
            markup_code: c("syntax.markupCode"),
            markup_quote: c("syntax.markupQuote"),
            // state
            error: c("state.error"),
            warning: c("state.warning"),
            info: c("state.info"),
            success: c("state.success"),
            // diff
            diff_added: c("diff.addedFg"),
            diff_removed: c("diff.removedFg"),
            diff_changed: c("diff.changedFg"),
            // ansi (terminal_color_*)
            ansi_black: c("ansi.black"),
            ansi_red: c("ansi.red"),
            ansi_green: c("ansi.green"),
            ansi_yellow: c("ansi.yellow"),
            ansi_blue: c("ansi.blue"),
            ansi_magenta: c("ansi.magenta"),
            ansi_cyan: c("ansi.cyan"),
            ansi_white: c("ansi.white"),
            ansi_bright_black: c("ansi.brightBlack"),
            ansi_bright_red: c("ansi.brightRed"),
            ansi_bright_green: c("ansi.brightGreen"),
            ansi_bright_yellow: c("ansi.brightYellow"),
            ansi_bright_blue: c("ansi.brightBlue"),
            ansi_bright_magenta: c("ansi.brightMagenta"),
            ansi_bright_cyan: c("ansi.brightCyan"),
            ansi_bright_white: c("ansi.brightWhite"),
        };
        out.push(`M.${variant} = {`);
        for (const [k, v] of Object.entries(roles)) {
            out.push(`    ${k} = "${stripAlpha(v)}",`);
        }
        out.push("}", "");
    }
    out.push("return M", "");
    return out.join("\n");
}

// ---------------------------------------------------------------------------
// Highlight groups (Lua). Receives a `p` palette table and returns an array
// of { name, opts } pairs that get applied via vim.api.nvim_set_hl.
// ---------------------------------------------------------------------------
const HIGHLIGHTS_LUA = `-- Generated from source/palette.json. Do not edit by hand.
local M = {}

function M.get(p)
    local hi = {}
    local function set(name, opts) hi[name] = opts end

    -- ---------- Editor surface ----------
    set("Normal",            { fg = p.fg, bg = p.bg })
    set("NormalNC",          { fg = p.fg, bg = p.bg })
    set("NormalFloat",       { fg = p.fg, bg = p.bg_menu })
    set("FloatBorder",       { fg = p.border_strong, bg = p.bg_menu })
    set("FloatTitle",        { fg = p.primary, bg = p.bg_menu, bold = true })
    set("Cursor",            { fg = p.bg, bg = p.primary })
    set("CursorLine",        { bg = p.bg_elev1 })
    set("CursorColumn",      { bg = p.bg_elev1 })
    set("CursorLineNr",      { fg = p.primary, bold = true })
    set("LineNr",            { fg = p.fg_disabled })
    set("LineNrAbove",       { fg = p.fg_disabled })
    set("LineNrBelow",       { fg = p.fg_disabled })
    set("SignColumn",        { bg = p.bg })
    set("FoldColumn",        { fg = p.fg_disabled, bg = p.bg })
    set("Folded",            { fg = p.fg_muted, bg = p.bg_elev1 })
    set("ColorColumn",       { bg = p.bg_elev1 })
    set("Visual",            { bg = p.bg_elev2 })
    set("VisualNOS",         { bg = p.bg_elev2 })
    set("MatchParen",        { fg = p.primary, bold = true, underline = true })
    set("Conceal",           { fg = p.fg_muted })
    set("NonText",           { fg = p.fg_disabled })
    set("Whitespace",        { fg = p.fg_disabled })
    set("SpecialKey",        { fg = p.fg_disabled })
    set("EndOfBuffer",       { fg = p.bg })

    -- ---------- Search / IncSearch ----------
    set("Search",            { fg = p.fg, bg = p.selection })
    set("IncSearch",         { fg = p.fg_inverse, bg = p.primary })
    set("CurSearch",         { fg = p.fg_inverse, bg = p.primary })
    set("Substitute",        { fg = p.fg_inverse, bg = p.primary_hover })

    -- ---------- Statusline / Tabline / Winbar ----------
    set("StatusLine",        { fg = p.fg, bg = p.bg })
    set("StatusLineNC",      { fg = p.fg_muted, bg = p.bg })
    set("TabLine",           { fg = p.fg_muted, bg = p.bg_elev1 })
    set("TabLineFill",       { bg = p.bg })
    set("TabLineSel",        { fg = p.fg, bg = p.bg, bold = true })
    set("WinBar",            { fg = p.fg, bg = p.bg })
    set("WinBarNC",          { fg = p.fg_muted, bg = p.bg })
    set("WinSeparator",      { fg = p.border })
    set("VertSplit",         { fg = p.border })

    -- ---------- Popup / Pmenu ----------
    set("Pmenu",             { fg = p.fg, bg = p.bg_menu })
    set("PmenuSel",          { fg = p.fg, bg = p.bg_elev2, bold = true })
    set("PmenuSbar",         { bg = p.bg_elev1 })
    set("PmenuThumb",        { bg = p.border_strong })
    set("PmenuKind",         { fg = p.primary, bg = p.bg_menu })
    set("PmenuKindSel",      { fg = p.primary, bg = p.bg_elev2, bold = true })
    set("PmenuExtra",        { fg = p.fg_muted, bg = p.bg_menu })
    set("PmenuExtraSel",     { fg = p.fg_muted, bg = p.bg_elev2 })
    set("WildMenu",          { fg = p.fg, bg = p.bg_elev2 })

    -- ---------- Messages ----------
    set("ErrorMsg",          { fg = p.error })
    set("WarningMsg",        { fg = p.warning })
    set("MoreMsg",           { fg = p.success })
    set("ModeMsg",           { fg = p.fg, bold = true })
    set("MsgArea",           { fg = p.fg, bg = p.bg })
    set("MsgSeparator",      { fg = p.border, bg = p.bg })
    set("Question",          { fg = p.info })
    set("Title",             { fg = p.markup_heading, bold = true })
    set("Directory",         { fg = p.primary })

    -- ---------- Spell ----------
    set("SpellBad",          { sp = p.error,   undercurl = true })
    set("SpellCap",          { sp = p.warning, undercurl = true })
    set("SpellRare",         { sp = p.info,    undercurl = true })
    set("SpellLocal",        { sp = p.info,    undercurl = true })

    -- ---------- Diff ----------
    set("DiffAdd",           { fg = p.diff_added,   bg = p.bg_elev1 })
    set("DiffChange",        { fg = p.diff_changed, bg = p.bg_elev1 })
    set("DiffDelete",        { fg = p.diff_removed, bg = p.bg_elev1 })
    set("DiffText",          { fg = p.diff_changed, bg = p.bg_elev2, bold = true })

    -- ---------- Syntax (legacy, fallback when Treesitter is off) ----------
    set("Comment",           { fg = p.comment, italic = true })
    set("Constant",          { fg = p.constant })
    set("String",            { fg = p.string })
    set("Character",         { fg = p.string })
    set("Number",            { fg = p.number })
    set("Boolean",           { fg = p.constant })
    set("Float",             { fg = p.number })
    set("Identifier",        { fg = p.variable })
    set("Function",          { fg = p.fn })
    set("Statement",         { fg = p.kw })
    set("Conditional",       { fg = p.kw })
    set("Repeat",            { fg = p.kw })
    set("Label",             { fg = p.kw })
    set("Operator",          { fg = p.operator })
    set("Keyword",           { fg = p.kw })
    set("Exception",         { fg = p.kw })
    set("PreProc",           { fg = p.decorator })
    set("Include",           { fg = p.kw })
    set("Define",            { fg = p.kw })
    set("Macro",             { fg = p.decorator })
    set("PreCondit",         { fg = p.kw })
    set("Type",              { fg = p.type })
    set("StorageClass",      { fg = p.kw })
    set("Structure",         { fg = p.type })
    set("Typedef",           { fg = p.type })
    set("Special",           { fg = p.string_escape })
    set("SpecialChar",       { fg = p.string_escape })
    set("SpecialComment",    { fg = p.comment, italic = true })
    set("Tag",               { fg = p.tag })
    set("Delimiter",         { fg = p.punctuation })
    set("Debug",             { fg = p.warning })
    set("Underlined",        { fg = p.markup_link, underline = true })
    set("Error",             { fg = p.error })
    set("Todo",              { fg = p.bg, bg = p.warning, bold = true })

    -- ---------- Treesitter (modern @groups) ----------
    set("@variable",                 { fg = p.variable })
    set("@variable.builtin",         { fg = p.language_variable, italic = true })
    set("@variable.parameter",       { fg = p.parameter, italic = true })
    set("@variable.member",          { fg = p.variable })
    set("@constant",                 { fg = p.constant })
    set("@constant.builtin",         { fg = p.constant })
    set("@constant.macro",           { fg = p.decorator })
    set("@module",                   { fg = p.namespace })
    set("@module.builtin",           { fg = p.namespace })
    set("@label",                    { fg = p.kw })
    set("@string",                   { fg = p.string })
    set("@string.documentation",     { fg = p.comment, italic = true })
    set("@string.regexp",            { fg = p.regex })
    set("@string.escape",            { fg = p.string_escape })
    set("@string.special",           { fg = p.string_escape })
    set("@string.special.url",       { fg = p.markup_link, underline = true })
    set("@character",                { fg = p.string })
    set("@character.special",        { fg = p.string_escape })
    set("@boolean",                  { fg = p.constant })
    set("@number",                   { fg = p.number })
    set("@number.float",             { fg = p.number })
    set("@type",                     { fg = p.type })
    set("@type.builtin",             { fg = p.type })
    set("@type.definition",          { fg = p.type })
    set("@attribute",                { fg = p.decorator })
    set("@attribute.builtin",        { fg = p.decorator })
    set("@property",                 { fg = p.variable })
    set("@function",                 { fg = p.fn })
    set("@function.builtin",         { fg = p.fn })
    set("@function.call",            { fg = p.fn })
    set("@function.macro",           { fg = p.decorator })
    set("@function.method",          { fg = p.fn })
    set("@function.method.call",     { fg = p.fn })
    set("@constructor",              { fg = p.type })
    set("@operator",                 { fg = p.operator })
    set("@keyword",                  { fg = p.kw })
    set("@keyword.coroutine",        { fg = p.kw })
    set("@keyword.function",         { fg = p.kw })
    set("@keyword.operator",         { fg = p.operator })
    set("@keyword.import",           { fg = p.kw })
    set("@keyword.type",             { fg = p.kw })
    set("@keyword.modifier",         { fg = p.kw })
    set("@keyword.repeat",           { fg = p.kw })
    set("@keyword.return",           { fg = p.kw })
    set("@keyword.debug",            { fg = p.warning })
    set("@keyword.exception",        { fg = p.kw })
    set("@keyword.conditional",      { fg = p.kw })
    set("@keyword.directive",        { fg = p.decorator })
    set("@keyword.directive.define", { fg = p.kw })
    set("@punctuation.delimiter",    { fg = p.punctuation })
    set("@punctuation.bracket",      { fg = p.punctuation })
    set("@punctuation.special",      { fg = p.kw })
    set("@comment",                  { fg = p.comment, italic = true })
    set("@comment.documentation",    { fg = p.comment, italic = true })
    set("@comment.error",            { fg = p.error, bold = true })
    set("@comment.warning",          { fg = p.warning, bold = true })
    set("@comment.todo",             { fg = p.warning, bold = true })
    set("@comment.note",             { fg = p.info, bold = true })
    set("@markup.strong",            { fg = p.markup_heading, bold = true })
    set("@markup.italic",            { fg = p.kw, italic = true })
    set("@markup.strikethrough",     { strikethrough = true })
    set("@markup.underline",         { underline = true })
    set("@markup.heading",           { fg = p.markup_heading, bold = true })
    set("@markup.heading.1",         { fg = p.markup_heading, bold = true })
    set("@markup.heading.2",         { fg = p.markup_heading, bold = true })
    set("@markup.heading.3",         { fg = p.markup_heading, bold = true })
    set("@markup.heading.4",         { fg = p.markup_heading, bold = true })
    set("@markup.heading.5",         { fg = p.markup_heading, bold = true })
    set("@markup.heading.6",         { fg = p.markup_heading, bold = true })
    set("@markup.quote",             { fg = p.markup_quote, italic = true })
    set("@markup.math",              { fg = p.constant })
    set("@markup.environment",       { fg = p.kw })
    set("@markup.link",              { fg = p.markup_link })
    set("@markup.link.label",        { fg = p.markup_link })
    set("@markup.link.url",          { fg = p.markup_link, underline = true })
    set("@markup.raw",               { fg = p.markup_code })
    set("@markup.raw.block",         { fg = p.markup_code })
    set("@markup.list",              { fg = p.markup_heading })
    set("@markup.list.checked",      { fg = p.success })
    set("@markup.list.unchecked",    { fg = p.fg_muted })
    set("@diff.plus",                { fg = p.diff_added })
    set("@diff.minus",               { fg = p.diff_removed })
    set("@diff.delta",               { fg = p.diff_changed })
    set("@tag",                      { fg = p.tag })
    set("@tag.builtin",              { fg = p.tag })
    set("@tag.attribute",            { fg = p.attribute })
    set("@tag.delimiter",            { fg = p.punctuation })

    -- ---------- LSP semantic tokens ----------
    set("@lsp.type.namespace",      { link = "@module" })
    set("@lsp.type.type",           { link = "@type" })
    set("@lsp.type.class",          { link = "@type" })
    set("@lsp.type.enum",           { link = "@type" })
    set("@lsp.type.interface",      { link = "@type" })
    set("@lsp.type.struct",         { link = "@type" })
    set("@lsp.type.parameter",      { link = "@variable.parameter" })
    set("@lsp.type.variable",       { link = "@variable" })
    set("@lsp.type.property",       { link = "@property" })
    set("@lsp.type.enumMember",     { link = "@constant" })
    set("@lsp.type.event",          { link = "@type" })
    set("@lsp.type.function",       { link = "@function" })
    set("@lsp.type.method",         { link = "@function.method" })
    set("@lsp.type.macro",          { link = "@function.macro" })
    set("@lsp.type.decorator",      { link = "@attribute" })
    set("@lsp.type.keyword",        { link = "@keyword" })
    set("@lsp.type.modifier",       { link = "@keyword.modifier" })
    set("@lsp.type.comment",        { link = "@comment" })
    set("@lsp.type.string",         { link = "@string" })
    set("@lsp.type.number",         { link = "@number" })
    set("@lsp.type.regexp",         { link = "@string.regexp" })
    set("@lsp.type.operator",       { link = "@operator" })
    set("@lsp.typemod.variable.readonly",      { fg = p.fn })
    set("@lsp.typemod.variable.defaultLibrary",{ fg = p.language_variable, italic = true })
    set("@lsp.typemod.function.defaultLibrary",{ link = "@function.builtin" })
    set("@lsp.typemod.method.defaultLibrary",  { link = "@function.builtin" })

    -- ---------- Diagnostics ----------
    set("DiagnosticError",         { fg = p.error })
    set("DiagnosticWarn",          { fg = p.warning })
    set("DiagnosticInfo",          { fg = p.info })
    set("DiagnosticHint",          { fg = p.fg_muted })
    set("DiagnosticOk",            { fg = p.success })
    set("DiagnosticUnnecessary",   { fg = p.fg_disabled })
    set("DiagnosticDeprecated",    { fg = p.fg_disabled, strikethrough = true })
    set("DiagnosticUnderlineError",{ sp = p.error,   undercurl = true })
    set("DiagnosticUnderlineWarn", { sp = p.warning, undercurl = true })
    set("DiagnosticUnderlineInfo", { sp = p.info,    undercurl = true })
    set("DiagnosticUnderlineHint", { sp = p.fg_muted,undercurl = true })
    set("DiagnosticVirtualTextError", { fg = p.error,   bg = p.bg })
    set("DiagnosticVirtualTextWarn",  { fg = p.warning, bg = p.bg })
    set("DiagnosticVirtualTextInfo",  { fg = p.info,    bg = p.bg })
    set("DiagnosticVirtualTextHint",  { fg = p.fg_muted,bg = p.bg })
    set("DiagnosticSignError",     { fg = p.error })
    set("DiagnosticSignWarn",      { fg = p.warning })
    set("DiagnosticSignInfo",      { fg = p.info })
    set("DiagnosticSignHint",      { fg = p.fg_muted })

    -- ---------- LSP misc ----------
    set("LspReferenceText",        { bg = p.bg_elev2 })
    set("LspReferenceRead",        { bg = p.bg_elev2 })
    set("LspReferenceWrite",       { bg = p.bg_elev2 })
    set("LspSignatureActiveParameter", { fg = p.parameter, italic = true, bold = true })
    set("LspInlayHint",            { fg = p.fg_disabled, italic = true })
    set("LspCodeLens",             { fg = p.fg_muted })
    set("LspCodeLensSeparator",    { fg = p.fg_disabled })

    -- ---------- gitsigns.nvim ----------
    set("GitSignsAdd",             { fg = p.diff_added })
    set("GitSignsChange",          { fg = p.diff_changed })
    set("GitSignsDelete",          { fg = p.diff_removed })
    set("GitSignsAddNr",           { fg = p.diff_added })
    set("GitSignsChangeNr",        { fg = p.diff_changed })
    set("GitSignsDeleteNr",        { fg = p.diff_removed })
    set("GitSignsCurrentLineBlame",{ fg = p.fg_disabled, italic = true })
    set("GitSignsAddInline",       { bg = p.bg_elev1 })
    set("GitSignsChangeInline",    { bg = p.bg_elev1 })
    set("GitSignsDeleteInline",    { bg = p.bg_elev1 })

    -- ---------- telescope.nvim ----------
    set("TelescopeNormal",          { fg = p.fg, bg = p.bg_menu })
    set("TelescopeBorder",          { fg = p.border_strong, bg = p.bg_menu })
    set("TelescopePromptNormal",    { fg = p.fg, bg = p.bg_input })
    set("TelescopePromptBorder",    { fg = p.border_strong, bg = p.bg_input })
    set("TelescopePromptTitle",     { fg = p.fg_inverse, bg = p.primary, bold = true })
    set("TelescopePromptPrefix",    { fg = p.primary })
    set("TelescopePromptCounter",   { fg = p.fg_muted })
    set("TelescopeResultsTitle",    { fg = p.fg_inverse, bg = p.primary })
    set("TelescopePreviewTitle",    { fg = p.fg_inverse, bg = p.primary })
    set("TelescopeSelection",       { fg = p.fg, bg = p.bg_elev2, bold = true })
    set("TelescopeSelectionCaret",  { fg = p.primary, bg = p.bg_elev2 })
    set("TelescopeMatching",        { fg = p.primary, bold = true })
    set("TelescopeMultiSelection",  { fg = p.fg, bg = p.bg_elev1 })
    set("TelescopeMultiIcon",       { fg = p.primary })

    -- ---------- nvim-tree ----------
    set("NvimTreeNormal",          { fg = p.fg, bg = p.bg_sidebar })
    set("NvimTreeNormalNC",        { fg = p.fg, bg = p.bg_sidebar })
    set("NvimTreeWinSeparator",    { fg = p.border, bg = p.bg_sidebar })
    set("NvimTreeRootFolder",      { fg = p.markup_heading, bold = true })
    set("NvimTreeFolderIcon",      { fg = p.primary })
    set("NvimTreeFolderName",      { fg = p.fg })
    set("NvimTreeOpenedFolderName",{ fg = p.fg, bold = true })
    set("NvimTreeEmptyFolderName", { fg = p.fg_muted })
    set("NvimTreeIndentMarker",    { fg = p.border })
    set("NvimTreeSymlink",         { fg = p.markup_link })
    set("NvimTreeFileIcon",        { fg = p.fg_muted })
    set("NvimTreeGitDirty",        { fg = p.diff_changed })
    set("NvimTreeGitNew",          { fg = p.diff_added })
    set("NvimTreeGitDeleted",      { fg = p.diff_removed })
    set("NvimTreeGitStaged",       { fg = p.diff_added })
    set("NvimTreeGitMerge",        { fg = p.warning })
    set("NvimTreeGitRenamed",      { fg = p.info })
    set("NvimTreeGitIgnored",      { fg = p.fg_disabled })
    set("NvimTreeSpecialFile",     { fg = p.markup_heading, underline = true })
    set("NvimTreeCursorLine",      { bg = p.bg_elev1 })

    -- ---------- neo-tree.nvim ----------
    set("NeoTreeNormal",           { fg = p.fg, bg = p.bg_sidebar })
    set("NeoTreeNormalNC",         { fg = p.fg, bg = p.bg_sidebar })
    set("NeoTreeDirectoryIcon",    { fg = p.primary })
    set("NeoTreeDirectoryName",    { fg = p.fg })
    set("NeoTreeFileIcon",         { fg = p.fg_muted })
    set("NeoTreeFileName",         { fg = p.fg })
    set("NeoTreeRootName",         { fg = p.markup_heading, bold = true })
    set("NeoTreeIndentMarker",     { fg = p.border })
    set("NeoTreeSymbolicLinkTarget", { fg = p.markup_link })
    set("NeoTreeGitAdded",         { fg = p.diff_added })
    set("NeoTreeGitConflict",      { fg = p.warning })
    set("NeoTreeGitDeleted",       { fg = p.diff_removed })
    set("NeoTreeGitIgnored",       { fg = p.fg_disabled })
    set("NeoTreeGitModified",      { fg = p.diff_changed })
    set("NeoTreeGitUnstaged",      { fg = p.diff_changed })
    set("NeoTreeGitUntracked",     { fg = p.diff_added })
    set("NeoTreeGitStaged",        { fg = p.diff_added })
    set("NeoTreeFloatBorder",      { fg = p.border_strong, bg = p.bg_menu })
    set("NeoTreeTitleBar",         { fg = p.fg_inverse, bg = p.primary, bold = true })

    -- ---------- lualine support colors ----------
    -- (lualine reads colors via theme tables, but these named groups give a
    -- sensible default if a user picks "auto" theme.)
    set("lualine_a_normal",        { fg = p.fg_inverse, bg = p.primary, bold = true })
    set("lualine_a_insert",        { fg = p.fg_inverse, bg = p.success, bold = true })
    set("lualine_a_visual",        { fg = p.fg_inverse, bg = p.constant, bold = true })
    set("lualine_a_replace",       { fg = p.fg_inverse, bg = p.error,   bold = true })
    set("lualine_a_command",       { fg = p.fg_inverse, bg = p.warning, bold = true })
    set("lualine_b_normal",        { fg = p.fg, bg = p.bg_elev2 })
    set("lualine_c_normal",        { fg = p.fg_muted, bg = p.bg })

    return hi
end

return M
`;

// ---------------------------------------------------------------------------
// init.lua, util.lua
// ---------------------------------------------------------------------------
const INIT_LUA = `-- Generated. Do not edit.
local M = {}

local config = {
    variant = "auto",      -- "light" | "dark" | "auto"
    transparent = false,
    italic_comments = true,
    italic_keywords = false,
    terminal_colors = true,
}

function M.setup(opts)
    config = vim.tbl_deep_extend("force", config, opts or {})
end

local function resolve_variant()
    if config.variant == "auto" then
        return (vim.o.background == "light") and "light" or "dark"
    end
    return config.variant
end

function M.load(variant)
    variant = variant or resolve_variant()

    if vim.g.colors_name then vim.cmd("hi clear") end
    if vim.fn.exists("syntax_on") == 1 then vim.cmd("syntax reset") end
    vim.o.termguicolors = true
    vim.o.background = variant
    vim.g.colors_name = "makinda-" .. variant

    local palette = require("makinda.palette")[variant]
    if not palette then
        error("makinda: unknown variant: " .. tostring(variant))
    end

    local p = vim.deepcopy(palette)
    if config.transparent then
        p.bg = "NONE"
        p.bg_sidebar = "NONE"
        p.bg_panel = "NONE"
    end

    local hi = require("makinda.highlights").get(p)

    if not config.italic_comments then
        for _, name in ipairs({ "Comment", "@comment", "@comment.documentation", "SpecialComment" }) do
            if hi[name] then hi[name].italic = false end
        end
    end
    if config.italic_keywords then
        for _, name in ipairs({ "Keyword", "Statement", "@keyword" }) do
            if hi[name] then hi[name].italic = true end
        end
    end

    for name, opts in pairs(hi) do
        vim.api.nvim_set_hl(0, name, opts)
    end

    if config.terminal_colors then
        vim.g.terminal_color_0  = p.ansi_black
        vim.g.terminal_color_1  = p.ansi_red
        vim.g.terminal_color_2  = p.ansi_green
        vim.g.terminal_color_3  = p.ansi_yellow
        vim.g.terminal_color_4  = p.ansi_blue
        vim.g.terminal_color_5  = p.ansi_magenta
        vim.g.terminal_color_6  = p.ansi_cyan
        vim.g.terminal_color_7  = p.ansi_white
        vim.g.terminal_color_8  = p.ansi_bright_black
        vim.g.terminal_color_9  = p.ansi_bright_red
        vim.g.terminal_color_10 = p.ansi_bright_green
        vim.g.terminal_color_11 = p.ansi_bright_yellow
        vim.g.terminal_color_12 = p.ansi_bright_blue
        vim.g.terminal_color_13 = p.ansi_bright_magenta
        vim.g.terminal_color_14 = p.ansi_bright_cyan
        vim.g.terminal_color_15 = p.ansi_bright_white
    end
end

return M
`;

function colorsLua(variant) {
    return `-- Entry point for ":colorscheme makinda-${variant}".
require("makinda").load("${variant}")
`;
}

// ---------------------------------------------------------------------------
// Vim fallback (.vim) — small but functional. Uses gui + cterm.
// ---------------------------------------------------------------------------
function vimFallback(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";

    const roles = {
        bg: c("bg.editor"),
        bg_elev1: c("bg.elevated1"),
        bg_elev2: c("bg.elevated2"),
        bg_menu: c("bg.menu"),
        fg: c("fg.default"),
        fg_muted: c("fg.muted"),
        fg_subtle: c("fg.subtle"),
        fg_disabled: c("fg.disabled"),
        border: c("border.default"),
        primary: c("brand.primary"),
        kw: c("syntax.keyword"),
        fn: c("syntax.function"),
        type: c("syntax.type"),
        constant: c("syntax.constant"),
        number: c("syntax.number"),
        string: c("syntax.string"),
        string_escape: c("syntax.stringEscape"),
        comment: c("syntax.comment"),
        operator: c("syntax.operator"),
        punctuation: c("syntax.punctuation"),
        tag: c("syntax.tag"),
        attribute: c("syntax.attribute"),
        markup_heading: c("syntax.markupHeading"),
        markup_link: c("syntax.markupLink"),
        markup_code: c("syntax.markupCode"),
        error: c("state.error"),
        warning: c("state.warning"),
        info: c("state.info"),
        success: c("state.success"),
        diff_added: c("diff.addedFg"),
        diff_changed: c("diff.changedFg"),
        diff_removed: c("diff.removedFg"),
    };

    const G = (name, args) => {
        // Build a `hi` line. args: { fg, bg, sp, gui }
        const parts = [`hi ${name}`];
        if (args.fg) parts.push(`guifg=${stripAlpha(args.fg)} ctermfg=${nearestCterm(args.fg)}`);
        else parts.push("guifg=NONE ctermfg=NONE");
        if (args.bg) parts.push(`guibg=${stripAlpha(args.bg)} ctermbg=${nearestCterm(args.bg)}`);
        else parts.push("guibg=NONE ctermbg=NONE");
        if (args.sp) parts.push(`guisp=${stripAlpha(args.sp)}`);
        const gui = args.gui || "NONE";
        parts.push(`gui=${gui} cterm=${gui}`);
        return parts.join(" ");
    };

    const lines = [
        `" Makinda ${isDark ? "Dark" : "Light"} \u2014 Vim fallback color scheme`,
        `" Generated from source/palette.json. Do not edit by hand.`,
        ``,
        `set background=${variant}`,
        `hi clear`,
        `if exists("syntax_on") | syntax reset | endif`,
        `let g:colors_name = "makinda-${variant}"`,
        ``,
        G("Normal", { fg: roles.fg, bg: roles.bg }),
        G("NormalNC", { fg: roles.fg, bg: roles.bg }),
        G("NormalFloat", { fg: roles.fg, bg: roles.bg_menu }),
        G("FloatBorder", { fg: roles.border, bg: roles.bg_menu }),
        G("CursorLine", { bg: roles.bg_elev1 }),
        G("CursorLineNr", { fg: roles.primary, gui: "bold" }),
        G("LineNr", { fg: roles.fg_disabled }),
        G("SignColumn", { bg: roles.bg }),
        G("VertSplit", { fg: roles.border, bg: roles.bg }),
        G("WinSeparator", { fg: roles.border, bg: roles.bg }),
        G("StatusLine", { fg: roles.fg, bg: roles.bg }),
        G("StatusLineNC", { fg: roles.fg_muted, bg: roles.bg }),
        G("TabLine", { fg: roles.fg_muted, bg: roles.bg_elev1 }),
        G("TabLineFill", { bg: roles.bg }),
        G("TabLineSel", { fg: roles.fg, bg: roles.bg, gui: "bold" }),
        G("Pmenu", { fg: roles.fg, bg: roles.bg_menu }),
        G("PmenuSel", { fg: roles.fg, bg: roles.bg_elev2, gui: "bold" }),
        G("Visual", { bg: roles.bg_elev2 }),
        G("Search", { fg: roles.fg, bg: roles.bg_elev2 }),
        G("IncSearch", { fg: c("fg.inverse"), bg: roles.primary }),
        G("MatchParen", { fg: roles.primary, gui: "bold,underline" }),
        G("Folded", { fg: roles.fg_muted, bg: roles.bg_elev1 }),
        G("Comment", { fg: roles.comment, gui: "italic" }),
        G("Constant", { fg: roles.constant }),
        G("String", { fg: roles.string }),
        G("Character", { fg: roles.string }),
        G("Number", { fg: roles.number }),
        G("Boolean", { fg: roles.constant }),
        G("Float", { fg: roles.number }),
        G("Identifier", { fg: roles.fg }),
        G("Function", { fg: roles.fn }),
        G("Statement", { fg: roles.kw }),
        G("Conditional", { fg: roles.kw }),
        G("Repeat", { fg: roles.kw }),
        G("Label", { fg: roles.kw }),
        G("Operator", { fg: roles.operator }),
        G("Keyword", { fg: roles.kw }),
        G("Exception", { fg: roles.kw }),
        G("PreProc", { fg: roles.attribute }),
        G("Include", { fg: roles.kw }),
        G("Define", { fg: roles.kw }),
        G("Macro", { fg: roles.attribute }),
        G("Type", { fg: roles.type }),
        G("StorageClass", { fg: roles.kw }),
        G("Structure", { fg: roles.type }),
        G("Typedef", { fg: roles.type }),
        G("Special", { fg: roles.string_escape }),
        G("SpecialComment", { fg: roles.comment, gui: "italic" }),
        G("Tag", { fg: roles.tag }),
        G("Delimiter", { fg: roles.punctuation }),
        G("Underlined", { fg: roles.markup_link, gui: "underline" }),
        G("Title", { fg: roles.markup_heading, gui: "bold" }),
        G("Directory", { fg: roles.primary }),
        G("Error", { fg: roles.error }),
        G("ErrorMsg", { fg: roles.error }),
        G("WarningMsg", { fg: roles.warning }),
        G("MoreMsg", { fg: roles.success }),
        G("Question", { fg: roles.info }),
        G("DiffAdd", { fg: roles.diff_added, bg: roles.bg_elev1 }),
        G("DiffChange", { fg: roles.diff_changed, bg: roles.bg_elev1 }),
        G("DiffDelete", { fg: roles.diff_removed, bg: roles.bg_elev1 }),
        G("DiffText", { fg: roles.diff_changed, bg: roles.bg_elev2, gui: "bold" }),
        G("Todo", { fg: roles.bg, bg: roles.warning, gui: "bold" }),
        ``,
    ];
    return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Write outputs
// ---------------------------------------------------------------------------
console.log("Building Neovim/Vim port\u2026");
writeOut("ports/neovim/lua/makinda/palette.lua", buildPaletteLua());
writeOut("ports/neovim/lua/makinda/highlights.lua", HIGHLIGHTS_LUA);
writeOut("ports/neovim/lua/makinda/init.lua", INIT_LUA);
for (const v of VARIANTS) {
    writeOut(`ports/neovim/colors/makinda-${v}.lua`, colorsLua(v));
    writeOut(`ports/neovim/colors/makinda-${v}.vim`, vimFallback(v));
}
