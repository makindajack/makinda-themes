# Makinda Themes — Helix

Premium light and dark themes for [Helix](https://helix-editor.com) with warm
orange accents and excellent readability.

## Variants

- `makinda_light`
- `makinda_dark`

## Install (manual)

Copy both `.toml` files into Helix's user themes directory:

```bash
mkdir -p ~/.config/helix/themes
cp makinda_light.toml makinda_dark.toml ~/.config/helix/themes/
```

Then activate in `~/.config/helix/config.toml`:

```toml
theme = "makinda_dark"
# or
theme = "makinda_light"
```

Or live-pick via Helix's command palette: `:theme makinda_dark`.

## Source of truth

Generated from `source/palette.json`. Regenerate with:

```bash
npm run build:helix
```
