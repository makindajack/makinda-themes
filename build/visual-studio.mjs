#!/usr/bin/env node
/**
 * Generate Visual Studio (full IDE) `.vssettings` files from source/palette.json.
 * Output:
 *   ports/visual-studio/Makinda Light.vssettings
 *   ports/visual-studio/Makinda Dark.vssettings
 *
 * Visual Studio exports color settings as a partial Tools→Options snapshot
 * (UTF-8 XML). Import via: Tools → Import and Export Settings → Import.
 *
 * Color values are encoded as decimal `0x00BBGGRR` (ABGR) integers.
 * `Background=0x02000000` = "automatic", which lets VS pick a sensible default.
 */

import { loadPalette, makeResolver, writeOut, VARIANTS } from "./lib/resolve.mjs";

const palette = loadPalette();

function abgr(hex) {
    const h = hex.replace("#", "").slice(0, 6);
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const v = (b << 16) | (g << 8) | r;
    return "0x02" + v.toString(16).padStart(6, "0").toUpperCase();
}

function item(name, fg, bg = null, bold = false) {
    const fgAttr = ` Foreground="${abgr(fg)}"`;
    const bgAttr = ` Background="${bg ? abgr(bg) : "0x02000000"}"`;
    const boldAttr = ` BoldFont="${bold ? "Yes" : "No"}"`;
    return `                            <Item Name="${name}"${fgAttr}${bgAttr}${boldAttr}/>`;
}

function build(variant) {
    const c = makeResolver(palette, variant);
    const isDark = variant === "dark";
    const label = `Makinda ${isDark ? "Dark" : "Light"}`;
    const bg = c("bg.editor");
    const fg = c("fg.default");

    const items = [
        item("Plain Text", fg, bg),
        item("Selected Text", fg, c("bg.elevated2")),
        item("Inactive Selected Text", fg, c("bg.elevated1")),
        item("Indicator Margin", fg, c("bg.elevated1")),
        item("Line Numbers", c("fg.disabled"), bg),
        item("Visible White Space", c("fg.disabled"), bg),
        item("Brace Matching (Rectangle)", c("brand.primary"), c("bg.elevated2")),
        item("Bookmark", c("brand.primary"), bg),
        item("Comment", c("syntax.comment"), bg),
        item("Identifier", fg, bg),
        item("Keyword", c("syntax.keyword"), bg, true),
        item("Number", c("syntax.number"), bg),
        item("Operator", c("syntax.operator"), bg),
        item("Punctuation", c("syntax.punctuation"), bg),
        item("String", c("syntax.string"), bg),
        item("String(C# @ Verbatim)", c("syntax.string"), bg),
        item("XML Doc Comment", c("syntax.comment"), bg),
        item("XML Doc Tag", c("syntax.tag"), bg),
        item("XML Attribute", c("syntax.attribute"), bg),
        item("XML Attribute Value", c("syntax.string"), bg),
        item("XML Name", c("syntax.tag"), bg),
        item("HTML Element Name", c("syntax.tag"), bg),
        item("HTML Attribute Name", c("syntax.attribute"), bg),
        item("HTML Attribute Value", c("syntax.string"), bg),
        item("HTML Comment", c("syntax.comment"), bg),
        item("CSS Property Name", c("syntax.attribute"), bg),
        item("CSS Property Value", c("syntax.constant"), bg),
        item("CSS Selector", c("syntax.tag"), bg),
        item("JSON - Property", fg, bg),
        item("JSON - String value", c("syntax.string"), bg),
        item("JSON - Number value", c("syntax.number"), bg),
        item("JSON - Keyword", c("syntax.constant"), bg),
        item("Preprocessor Keyword", c("syntax.decorator"), bg),
        item("User Types", c("syntax.type"), bg),
        item("User Types (Classes)", c("syntax.type"), bg),
        item("User Types (Delegates)", c("syntax.type"), bg),
        item("User Types (Enums)", c("syntax.type"), bg),
        item("User Types (Interfaces)", c("syntax.type"), bg),
        item("User Types (Type parameters)", c("syntax.type"), bg),
        item("User Types (Value types)", c("syntax.type"), bg),
        item("User Members (Methods)", c("syntax.function"), bg),
        item("User Members (Constants)", c("syntax.constant"), bg),
        item("User Members (Fields)", c("syntax.variable"), bg),
        item("User Members (Properties)", c("syntax.variable"), bg),
        item("User Members (Events)", c("syntax.function"), bg),
        item("User Members (Namespaces)", c("syntax.namespace"), bg),
        item("Compiler Error", c("state.error"), bg),
        item("Warning", c("state.warning"), bg),
        item("Other Error", c("state.error"), bg),
        item("Syntax Error", c("state.error"), bg),
    ];

    return `<UserSettings>
    <ApplicationIdentity version="17.0"/>
    <ToolsOptions>
        <ToolsOptionsCategory name="Environment" RegisteredName="Environment">
            <ToolsOptionsSubCategory name="FontsAndColors" RegisteredName="FontsAndColors" PackageName="Visual Studio Environment Package">
                <PropertyValue name="Version">2</PropertyValue>
                <FontsAndColors Version="2.0">
                    <Categories>
                        <Category GUID="{A27B4E24-A735-4D1D-B8E7-9716E1E3D8E0}" FontIsDefault="No" FontName="Consolas" FontSize="11" CharSet="1" FontIsBold="No">
                            <Items>
${items.join("\n")}
                            </Items>
                        </Category>
                    </Categories>
                </FontsAndColors>
            </ToolsOptionsSubCategory>
        </ToolsOptionsCategory>
    </ToolsOptions>
    <Category name="Makinda" Category="{${isDark ? "B6E3D7E1-9D6F-4F9F-9F7B-DARK0000MAKI" : "B6E3D7E1-9D6F-4F9F-9F7B-LITE0000MAKI"}}" Package="" RegisteredName="${label}">
        <PropertyValue name="DisplayName">${label}</PropertyValue>
    </Category>
</UserSettings>
`;
}

console.log("Building Visual Studio settings\u2026");
for (const v of VARIANTS) {
    const label = v === "dark" ? "Dark" : "Light";
    writeOut(`ports/visual-studio/Makinda ${label}.vssettings`, build(v));
}
