# Makinda Themes — Notepad++

## Install

1. Open Notepad++ → **Settings → Style Configurator…**
2. Click **Save As…** → name it "Makinda Dark" (or Light).
3. Close the dialog, then replace the saved theme file at:

   ```
   %APPDATA%\Notepad++\themes\Makinda Dark.xml
   ```

   with the file from this directory.

4. Reopen Notepad++ → **Style Configurator** → select the theme.

## Coverage

Global styles plus representative `LexerStyles` for cpp, java, python,
javascript, html, xml, css, json, sql, and markdown.

## Source of truth

Generated from `source/palette.json`. Regenerate with `npm run build:notepad-plus-plus`.
