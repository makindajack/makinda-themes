# Makinda Themes — Xcode

Premium light and dark color themes for Xcode with warm orange accents and
excellent readability.

## Variants

- **Makinda Light**
- **Makinda Dark**

## Install

From this directory:

```bash
chmod +x install.sh
./install.sh
```

Or copy manually into Xcode's user themes folder:

```bash
mkdir -p ~/Library/Developer/Xcode/UserData/FontAndColorThemes
cp "Makinda Light.xccolortheme" "Makinda Dark.xccolortheme" \
   ~/Library/Developer/Xcode/UserData/FontAndColorThemes/
```

Then restart Xcode and select the theme:

**Xcode → Settings → Themes → Makinda Light** (or **Makinda Dark**)

## Fonts

The theme references **SF Mono** at 12pt (regular / bold / italic), which ships
with macOS. Adjust per-token sizes via Xcode's theme editor if desired.

## Source of truth

Generated from `source/palette.json`. Regenerate with:

```bash
npm run build:xcode
```
