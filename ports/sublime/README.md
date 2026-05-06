# Makinda Themes — Sublime Text

Premium light and dark color schemes for Sublime Text 3 / 4 with warm orange
accents and excellent readability.

## Variants

- **Makinda Light**
- **Makinda Dark**

## Install via Package Control

1. Open the command palette: <kbd>Cmd</kbd>/<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>
2. Run **Package Control: Install Package**
3. Choose **Makinda Themes**
4. Activate via **Preferences → Select Color Scheme…** and pick _Makinda Light_
   or _Makinda Dark_

## Manual install

Copy the two `.sublime-color-scheme` files in this directory into your Sublime
Text **User** package directory:

- macOS: `~/Library/Application Support/Sublime Text/Packages/User/`
- Linux: `~/.config/sublime-text/Packages/User/`
- Windows: `%APPDATA%\Sublime Text\Packages\User\`

Then activate with **Preferences → Select Color Scheme…**.

## Source of truth

The `.sublime-color-scheme` files in this directory are generated artifacts.
Edit `source/palette.json` and run `npm run build:sublime` to regenerate.
