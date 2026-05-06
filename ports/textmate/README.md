# Makinda Themes — TextMate

`.tmTheme` files for TextMate (and any editor that consumes TextMate themes
directly, such as some Sublime Text plugins or older tooling).

## Install

Double-click each `.tmTheme` file in macOS Finder and TextMate will offer to
install it. Or copy manually into:

```
~/Library/Application Support/TextMate/Bundles/Themes.tmbundle/Themes/
```

Then activate via **TextMate → Preferences → Fonts & Colors**.

## Source of truth

Generated from `source/palette.json`. Regenerate with `npm run build:textmate`.
