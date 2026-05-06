#!/usr/bin/env node
/**
 * JetBrains theme port.
 *
 * Generates two files per variant:
 *   - `<name>.theme.json`  — IntelliJ Platform UI theme (workbench-like).
 *     Schema: https://plugins.jetbrains.com/docs/intellij/themes-customize.html
 *   - `<name>.icls`        — IntelliJ editor color scheme (XML).
 *     Schema: TextMate-style attributes per token type.
 *
 * Output:
 *   ports/jetbrains/src/main/resources/themes/makinda-light.theme.json
 *   ports/jetbrains/src/main/resources/themes/makinda-light.icls
 *   ports/jetbrains/src/main/resources/themes/makinda-dark.theme.json
 *   ports/jetbrains/src/main/resources/themes/makinda-dark.icls
 *
 * The static Gradle scaffold (plugin.xml, build.gradle.kts, etc.) lives next
 * to these files and is not regenerated.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

/** Strip "#" and any trailing alpha for slots that don't accept it. */
const rgb = (hex) => hex.replace("#", "").slice(0, 6).toUpperCase();
/** Keep alpha for slots that do accept #RRGGBBAA. */
const rgba = (hex) => hex.replace("#", "").toUpperCase();

// ---------------------------------------------------------------------------
// .theme.json (UI)
// ---------------------------------------------------------------------------
function buildThemeJson(variant, c) {
    const isDark = variant === "dark";
    return {
        name: `Makinda ${isDark ? "Dark" : "Light"}`,
        dark: isDark,
        author: "Jackson Makinda",
        editorScheme: `/themes/makinda-${variant}.icls`,
        colors: {
            // Named palette references usable from the `ui` map below via "namedKey".
            brandPrimary: c("brand.primary"),
            brandHover: c("brand.primaryHover"),
            bgEditor: c("bg.editor"),
            bgSidebar: c("bg.sidebar"),
            bgPanel: c("bg.panel"),
            bgInput: c("bg.input"),
            bgElevated1: c("bg.elevated1"),
            bgElevated2: c("bg.elevated2"),
            bgElevated3: c("bg.elevated3"),
            fgDefault: c("fg.default"),
            fgMuted: c("fg.muted"),
            fgSubtle: c("fg.subtle"),
            fgInverse: c("fg.inverse"),
            borderDefault: c("border.default"),
            borderStrong: c("border.strong"),
            borderFocus: c("border.focus"),
            stateError: c("state.error"),
            stateWarning: c("state.warning"),
            stateInfo: c("state.info"),
            stateSuccess: c("state.success"),
        },
        ui: {
            "*": {
                background: "bgEditor",
                foreground: "fgDefault",
                disabledForeground: "fgSubtle",
                inactiveBackground: "bgEditor",
                selectionBackground: "bgElevated2",
                selectionForeground: "fgDefault",
                selectionInactiveBackground: "bgElevated1",
                selectionInactiveForeground: "fgDefault",
                acceleratorForeground: "brandPrimary",
                acceleratorSelectionForeground: "fgInverse",
                errorForeground: "stateError",
                infoForeground: "fgMuted",
            },
            ActionButton: {
                hoverBackground: "bgElevated2",
                hoverBorderColor: "bgElevated2",
                pressedBackground: "bgElevated3",
                pressedBorderColor: "bgElevated3",
            },
            Button: {
                startBackground: "brandPrimary",
                endBackground: "brandPrimary",
                startBorderColor: "brandPrimary",
                endBorderColor: "brandPrimary",
                foreground: "fgInverse",
                default: {
                    startBackground: "brandPrimary",
                    endBackground: "brandHover",
                    startBorderColor: "brandPrimary",
                    endBorderColor: "brandHover",
                    foreground: "fgInverse",
                    focusColor: "brandPrimary",
                },
                disabledBorderColor: "borderDefault",
            },
            ComboBox: {
                background: "bgInput",
                nonEditableBackground: "bgInput",
                ArrowButton: {
                    background: "bgInput",
                    iconColor: "fgMuted",
                    nonEditableBackground: "bgInput",
                },
            },
            CheckBox: { background: "bgEditor" },
            Editor: {
                background: "bgEditor",
                foreground: "fgDefault",
                shortcutForeground: "brandPrimary",
            },
            EditorTabs: {
                background: "bgEditor",
                underlinedTabBackground: "bgEditor",
                underlinedTabForeground: "fgDefault",
                underlineColor: "brandPrimary",
                inactiveUnderlineColor: c("border.subtle"),
                hoverBackground: "bgElevated1",
                borderColor: "borderDefault",
            },
            Component: {
                focusColor: "brandPrimary",
                focusedBorderColor: "brandPrimary",
                borderColor: "borderDefault",
                disabledBorderColor: c("border.subtle"),
            },
            Link: {
                activeForeground: "brandPrimary",
                hoverForeground: "brandHover",
                pressedForeground: "brandHover",
                visitedForeground: c("syntax.type"),
            },
            MenuItem: {
                selectionBackground: "bgElevated2",
                selectionForeground: "fgDefault",
                acceleratorForeground: "fgMuted",
            },
            Menu: { background: c("bg.menu") },
            PopupMenu: { background: c("bg.menu") },
            Notification: {
                background: c("bg.menu"),
                borderColor: "borderDefault",
                errorBackground: c("bg.menu"),
                errorBorderColor: "stateError",
                errorForeground: "stateError",
            },
            ProgressBar: {
                progressColor: "brandPrimary",
                indeterminateStartColor: "brandPrimary",
                indeterminateEndColor: "brandHover",
            },
            ScrollBar: {
                thumbColor: c("border.strong"),
                hoverThumbColor: c("fg.subtle"),
                Mac: {
                    thumbColor: c("border.strong"),
                    hoverThumbColor: c("fg.subtle"),
                },
            },
            Separator: { separatorColor: "borderDefault" },
            StatusBar: {
                background: "bgEditor",
                borderColor: "borderDefault",
                hoverBackground: "bgElevated1",
            },
            TabbedPane: {
                background: "bgEditor",
                contentAreaColor: "borderDefault",
                focusColor: "brandPrimary",
                hoverColor: "bgElevated1",
                underlineColor: "brandPrimary",
                disabledUnderlineColor: c("border.subtle"),
                selectedForeground: "fgDefault",
                foreground: "fgMuted",
            },
            ToolBar: { background: "bgEditor", borderColor: "borderDefault" },
            ToolWindow: {
                background: "bgSidebar",
                Button: { hoverBackground: "bgElevated1", selectedBackground: "bgElevated2" },
                Header: {
                    background: "bgSidebar",
                    inactiveBackground: "bgSidebar",
                    borderColor: "borderDefault",
                },
                HeaderTab: {
                    underlinedTabBackground: "bgSidebar",
                    underlineColor: "brandPrimary",
                    hoverBackground: "bgElevated1",
                    inactiveUnderlineColor: c("border.subtle"),
                },
            },
            Tree: {
                background: "bgSidebar",
                foreground: "fgDefault",
                hoverBackground: "bgElevated1",
                selectionBackground: "bgElevated2",
                selectionForeground: "fgDefault",
                selectionInactiveBackground: "bgElevated1",
            },
            List: {
                background: "bgEditor",
                foreground: "fgDefault",
                hoverBackground: "bgElevated1",
                selectionBackground: "bgElevated2",
                selectionForeground: "fgDefault",
                selectionInactiveBackground: "bgElevated1",
            },
            Table: {
                background: "bgEditor",
                foreground: "fgDefault",
                gridColor: "borderDefault",
                selectionBackground: "bgElevated2",
                selectionForeground: "fgDefault",
            },
            TextField: {
                background: "bgInput",
                foreground: "fgDefault",
                borderColor: "borderDefault",
                hoverBorderColor: c("border.strong"),
                focusedBorderColor: "brandPrimary",
            },
            TextArea: {
                background: "bgInput",
                foreground: "fgDefault",
                selectionBackground: "bgElevated2",
            },
            ToolTip: {
                background: c("bg.menu"),
                foreground: "fgDefault",
                borderColor: "borderDefault",
            },
            ValidationTooltip: {
                errorBackground: c("bg.menu"),
                errorBorderColor: "stateError",
                warningBackground: c("bg.menu"),
                warningBorderColor: "stateWarning",
            },
            VersionControl: {
                FileHistory: {
                    Commit: { selectedBranchBackground: "bgElevated2" },
                },
                Log: {
                    Commit: { hoveredBackground: "bgElevated1" },
                },
            },
            WelcomeScreen: {
                background: "bgEditor",
                borderColor: "borderDefault",
                Projects: {
                    background: "bgEditor",
                    selectionBackground: "bgElevated2",
                    selectionInactiveBackground: "bgElevated1",
                    actions: { background: "bgEditor" },
                },
            },
        },
        icons: {
            ColorPalette: {
                "Actions.Blue": "brandPrimary",
                "Actions.Green": "stateSuccess",
                "Actions.Red": "stateError",
                "Actions.Yellow": "stateWarning",
                "Actions.Grey": "fgMuted",
            },
        },
    };
}

// ---------------------------------------------------------------------------
// .icls (Editor color scheme XML)
// ---------------------------------------------------------------------------
const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function attr(name, fg, opts = {}) {
    const lines = [`    <option name="${xmlEsc(name)}">`, `      <value>`];
    if (fg) lines.push(`        <option name="FOREGROUND" value="${rgb(fg)}" />`);
    if (opts.bg) lines.push(`        <option name="BACKGROUND" value="${rgb(opts.bg)}" />`);
    if (opts.fontType != null) lines.push(`        <option name="FONT_TYPE" value="${opts.fontType}" />`);
    if (opts.effectType != null) lines.push(`        <option name="EFFECT_TYPE" value="${opts.effectType}" />`);
    if (opts.effectColor) lines.push(`        <option name="EFFECT_COLOR" value="${rgb(opts.effectColor)}" />`);
    lines.push(`      </value>`, `    </option>`);
    return lines.join("\n");
}

function buildIcls(variant, c) {
    const isDark = variant === "dark";
    const parent = isDark ? "Darcula" : "Default";
    const name = `Makinda ${isDark ? "Dark" : "Light"}`;

    // Italic = 2, Bold = 1.
    const italic = { fontType: 2 };

    const colors = [
        // Editor surface
        ["CARET_COLOR", c("brand.primary")],
        ["CARET_ROW_COLOR", c("bg.elevated1")],
        ["CONSOLE_BACKGROUND_KEY", c("bg.editor")],
        ["GUTTER_BACKGROUND", c("bg.editor")],
        ["INDENT_GUIDE", c("border.subtle")],
        ["LINE_NUMBERS_COLOR", isDark ? c("fg.disabled") : c("fg.faint")],
        ["LINE_NUMBER_ON_CARET_ROW_COLOR", c("fg.default")],
        ["MODIFIED_LINES_COLOR", c("diff.changedFg")],
        ["NOTIFICATION_BACKGROUND", c("bg.menu")],
        ["RIGHT_MARGIN_COLOR", c("border.subtle")],
        ["SELECTED_INDENT_GUIDE", c("border.strong")],
        ["SELECTION_BACKGROUND", c("bg.elevated2")],
        ["SELECTION_FOREGROUND", c("fg.default")],
        ["TEARLINE_COLOR", c("border.default")],
        ["VISUAL_INDENT_GUIDE", c("border.subtle")],
        ["WHITESPACES", c("border.strong")],
    ];

    const colorsXml = colors
        .map(([k, v]) => `    <option name="${k}" value="${rgb(v)}" />`)
        .join("\n");

    const attributes = [
        // ── Generic syntax ──────────────────────────────────────────────────
        attr("TEXT", c("fg.default")),
        attr("BAD_CHARACTER", c("state.error"), { effectType: 5 }),
        attr("IDENTIFIER", c("syntax.variable")),
        attr("NUMBER", c("syntax.number")),
        attr("KEYWORD", c("syntax.keyword")),
        attr("STRING", c("syntax.string")),
        attr("VALID_STRING_ESCAPE", c("syntax.stringEscape")),
        attr("INVALID_STRING_ESCAPE", c("state.error")),
        attr("LINE_COMMENT", c("syntax.comment"), italic),
        attr("BLOCK_COMMENT", c("syntax.comment"), italic),
        attr("DOC_COMMENT", c("syntax.comment"), italic),
        attr("DOC_COMMENT_TAG", c("syntax.decorator")),
        attr("DOC_COMMENT_MARKUP", c("syntax.markupCode")),
        attr("OPERATION_SIGN", c("syntax.operator")),
        attr("BRACES", c("syntax.punctuation")),
        attr("BRACKETS", c("syntax.punctuation")),
        attr("PARENTHS", c("syntax.punctuation")),
        attr("DOT", c("syntax.punctuation")),
        attr("SEMICOLON", c("syntax.punctuation")),
        attr("COMMA", c("syntax.punctuation")),
        attr("LABEL", c("syntax.tag")),
        attr("CONSTANT", c("syntax.constant")),
        attr("LOCAL_VARIABLE", c("syntax.variable")),
        attr("REASSIGNED_LOCAL_VARIABLE_ATTRIBUTES", c("syntax.variable")),
        attr("REASSIGNED_PARAMETER_ATTRIBUTES", c("syntax.parameter")),
        attr("PARAMETER", c("syntax.parameter")),
        attr("STATIC_FIELD_ATTRIBUTES", c("syntax.constant")),
        attr("STATIC_METHOD_ATTRIBUTES", c("syntax.function")),
        attr("INSTANCE_FIELD_ATTRIBUTES", c("syntax.variable")),
        attr("INSTANCE_METHOD_ATTRIBUTES", c("syntax.function")),
        attr("METHOD_DECLARATION_ATTRIBUTES", c("syntax.function")),
        attr("METHOD_CALL_ATTRIBUTES", c("syntax.function")),
        attr("CLASS_NAME_ATTRIBUTES", c("syntax.type")),
        attr("INTERFACE_NAME_ATTRIBUTES", c("syntax.type")),
        attr("ABSTRACT_CLASS_NAME_ATTRIBUTES", c("syntax.type")),
        attr("CLASS_REFERENCE_ATTRIBUTES", c("syntax.type")),
        attr("ANONYMOUS_CLASS_NAME_ATTRIBUTES", c("syntax.type")),
        attr("ENUM_NAME_ATTRIBUTES", c("syntax.constant")),
        attr("TYPE_PARAMETER_NAME_ATTRIBUTES", c("syntax.type")),
        attr("ANNOTATION_NAME_ATTRIBUTES", c("syntax.decorator")),
        attr("ANNOTATION_ATTRIBUTE_NAME_ATTRIBUTES", c("syntax.attribute")),
        // ── Markup / templating ─────────────────────────────────────────────
        attr("HTML_TAG_NAME", c("syntax.tag")),
        attr("HTML_ATTRIBUTE_NAME", c("syntax.attribute")),
        attr("HTML_ATTRIBUTE_VALUE", c("syntax.string")),
        attr("HTML_TAG", c("syntax.punctuation")),
        attr("HTML_COMMENT", c("syntax.comment"), italic),
        attr("HTML_ENTITY_REFERENCE", c("syntax.stringEscape")),
        attr("XML_TAG_NAME", c("syntax.tag")),
        attr("XML_ATTRIBUTE_NAME", c("syntax.attribute")),
        attr("XML_ATTRIBUTE_VALUE", c("syntax.string")),
        attr("XML_TAG_DATA", c("fg.default")),
        attr("MARKDOWN_HEADER_LEVEL_1", c("syntax.markupHeading"), { fontType: 1 }),
        attr("MARKDOWN_HEADER_LEVEL_2", c("syntax.markupHeading"), { fontType: 1 }),
        attr("MARKDOWN_HEADER_LEVEL_3", c("syntax.markupHeading"), { fontType: 1 }),
        attr("MARKDOWN_BOLD", c("fg.default"), { fontType: 1 }),
        attr("MARKDOWN_ITALIC", c("fg.default"), italic),
        attr("MARKDOWN_LINK_DESTINATION", c("syntax.markupLink")),
        attr("MARKDOWN_BLOCK_QUOTE", c("syntax.markupQuote"), italic),
        attr("MARKDOWN_INLINE_CODE", c("syntax.markupCode")),
        attr("MARKDOWN_CODE_BLOCK", c("syntax.markupCode")),
        // ── Diagnostics ─────────────────────────────────────────────────────
        attr("ERRORS_ATTRIBUTES", c("state.error"), { effectType: 2, effectColor: c("state.error") }),
        attr("WARNING_ATTRIBUTES", c("state.warning"), { effectType: 2, effectColor: c("state.warning") }),
        attr("INFO_ATTRIBUTES", c("state.info"), { effectType: 2, effectColor: c("state.info") }),
        attr("DEPRECATED_ATTRIBUTES", c("fg.muted"), { effectType: 1, effectColor: c("fg.muted") }),
        attr("MARKED_FOR_REMOVAL_ATTRIBUTES", c("state.error"), { effectType: 1, effectColor: c("state.error") }),
        attr("TODO_DEFAULT_ATTRIBUTES", c("state.warning"), { fontType: 1 }),
        // ── Diff / VCS ──────────────────────────────────────────────────────
        attr("FILESTATUS_ADDED", c("diff.addedFg")),
        attr("FILESTATUS_MODIFIED", c("diff.changedFg")),
        attr("FILESTATUS_DELETED", c("diff.removedFg")),
        attr("FILESTATUS_IGNORED", c("fg.subtle")),
        attr("FILESTATUS_NOT_CHANGED", c("fg.muted")),
        attr("FILESTATUS_UNKNOWN", c("syntax.type")),
        // ── Console ─────────────────────────────────────────────────────────
        attr("CONSOLE_NORMAL_OUTPUT", c("fg.default")),
        attr("CONSOLE_ERROR_OUTPUT", c("state.error")),
        attr("CONSOLE_USER_INPUT", c("syntax.string")),
        attr("CONSOLE_RED_OUTPUT", c("ansi.red")),
        attr("CONSOLE_GREEN_OUTPUT", c("ansi.green")),
        attr("CONSOLE_YELLOW_OUTPUT", c("ansi.yellow")),
        attr("CONSOLE_BLUE_OUTPUT", c("ansi.blue")),
        attr("CONSOLE_MAGENTA_OUTPUT", c("ansi.magenta")),
        attr("CONSOLE_CYAN_OUTPUT", c("ansi.cyan")),
        attr("CONSOLE_WHITE_OUTPUT", c("ansi.white")),
        attr("CONSOLE_DARKGRAY_OUTPUT", c("ansi.brightBlack")),
    ].join("\n");

    return `<scheme name="${xmlEsc(name)}" version="142" parent_scheme="${parent}">
  <colors>
${colorsXml}
  </colors>
  <attributes>
${attributes}
  </attributes>
</scheme>
`;
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------
console.log("Building JetBrains themes…");
for (const variant of VARIANTS) {
    const c = makeResolver(palette, variant);
    const json = JSON.stringify(buildThemeJson(variant, c), null, 2) + "\n";
    writeOut(`ports/jetbrains/src/main/resources/themes/makinda-${variant}.theme.json`, json);
    writeOut(`ports/jetbrains/src/main/resources/themes/makinda-${variant}.icls`, buildIcls(variant, c));
}
