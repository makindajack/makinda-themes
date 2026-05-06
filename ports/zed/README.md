# Makinda Themes — Zed

Premium light and dark themes for [Zed](https://zed.dev) with warm orange
accents and excellent readability.

## Variants

- **Makinda Light**
- **Makinda Dark**

## Install (dev / local)

1. Clone this repo.
2. In Zed, open the command palette and run **zed: install dev extension**.
3. Select the `ports/zed/` directory.
4. Open **zed: open settings** and set:

   ```json
   {
     "theme": {
       "mode": "system",
       "light": "Makinda Light",
       "dark": "Makinda Dark"
     }
   }
   ```

## Install (registry)

Once published to the Zed extension registry:

1. Open the command palette → **zed: extensions**.
2. Search for **Makinda Themes** and click **Install**.
3. Activate via **zed: theme selector**.

## Source of truth

Files in `themes/` are generated. Edit `source/palette.json` and run
`npm run build:zed` to regenerate.
