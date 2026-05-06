<h1 align="center">
  <br>
  <img src="images/icon.png" alt="Makinda Themes" width="128">
  <br>
  Makinda Themes
  <br>
</h1>

<h4 align="center">Premium light and dark themes for VS Code with warm orange accents and excellent readability.</h4>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes">
    <img alt="Version" src="https://img.shields.io/visual-studio-marketplace/v/makindajack.makinda-themes.svg?style=for-the-badge&labelColor=0e0e0f&color=f05106">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes">
    <img alt="Downloads" src="https://img.shields.io/visual-studio-marketplace/d/makindajack.makinda-themes.svg?style=for-the-badge&labelColor=0e0e0f&color=f05106">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes">
    <img alt="Rating" src="https://img.shields.io/visual-studio-marketplace/stars/makindajack.makinda-themes.svg?style=for-the-badge&labelColor=0e0e0f&color=f05106">
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#compatible-editors">Compatible Editors</a> •
  <a href="#activate-a-theme">Activate</a> •
  <a href="#recommended-settings">Recommended Settings</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Features

This extension ships **two** complementary themes:

- **Makinda Light** — Clean white editor with subtle gray sidebars, warm orange accents, and high-contrast syntax highlighting for long, comfortable coding sessions.
- **Makinda Dark** — Deep `#0e0e0f` background with vibrant orange accents, purple types, and teal strings. 140+ token scopes and 200+ UI color definitions.

Both variants share the same brand language, so switching between them keeps your code visually consistent.

### Color Palette

| Element            | Makinda Light | Makinda Dark |
| ------------------ | ------------- | ------------ |
| Brand Orange       | `#f05106`     | `#ff6b0d`    |
| Functions          | `#f05106`     | `#ff8d37`    |
| Keywords           | `#c73b07`     | `#ff6b0d`    |
| Types / Classes    | `#7c3aed`     | `#a78bfa`    |
| Strings            | `#0d7377`     | `#2dd4bf`    |
| Comments           | `#6b7280`     | `#7d8593`    |
| Editor Background  | `#ffffff`     | `#0e0e0f`    |
| Sidebar Background | `#f9f9fa`     | `#0e0e0f`    |

## Installation

### From VS Code Marketplace

1. Open the **Extensions** sidebar: `View → Extensions`
2. Search for `Makinda Themes`
3. Click **Install**

### From Command Line

```bash
code --install-extension makindajack.makinda-themes
```

### Manual Installation

1. Download the latest `.vsix` from [Releases](https://github.com/makindajack/makinda-themes/releases)
2. In VS Code, run `Extensions: Install from VSIX...` from the Command Palette and pick the file.

## Compatible Editors

Makinda Themes works in every editor that consumes the VS Code extension format. The same `.vsix` is published to both marketplaces:

| Editor                              | Marketplace                                                                                           | Install                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **VS Code**                         | [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes) | `code --install-extension makindajack.makinda-themes`     |
| **Cursor**                          | VS Code Marketplace (or Open VSX)                                                                     | `cursor --install-extension makindajack.makinda-themes`   |
| **Windsurf**                        | [Open VSX](https://open-vsx.org/extension/makindajack/makinda-themes)                                 | `windsurf --install-extension makindajack.makinda-themes` |
| **VSCodium / code-server / Gitpod** | [Open VSX](https://open-vsx.org/extension/makindajack/makinda-themes)                                 | `codium --install-extension makindajack.makinda-themes`   |

See [docs/INSTALLATION.md](docs/INSTALLATION.md) for editor-by-editor walkthroughs and offline `.vsix` install steps.

## Activate a Theme

Open the Color Theme picker:

- macOS: `⌘K ⌘T`
- Windows / Linux: `Ctrl+K Ctrl+T`

Select **Makinda Light** or **Makinda Dark**.

To have VS Code switch automatically with your OS appearance, enable `window.autoDetectColorScheme` and set:

```json
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "Makinda Light",
  "workbench.preferredDarkColorTheme": "Makinda Dark"
}
```

## Recommended Settings

### Icon Themes

Pair Makinda Themes with one of these for a complete look:

- [Material Product Icons](https://marketplace.visualstudio.com/items?itemName=PKief.material-product-icons) by Philipp Kief
- [Nomo Light Icon Theme](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-icontheme-nomo-light) — pairs well with Makinda Light
- [Nomo Dark Icon Theme](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-icontheme-nomo-dark) — pairs well with Makinda Dark

> A dedicated **Makinda Icons** pack is in active development and will be released as a separate extension.

### Font Recommendations

```json
{
  "editor.fontFamily": "'Fira Code', 'JetBrains Mono', Menlo, Monaco, monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6
}
```

## Screenshots

### Makinda Light

![Makinda Light fragment](https://i.imgur.com/qxYdmP8.png)

![Makinda Light full](https://i.imgur.com/LKLWRX7.png)

### Makinda Dark

![Makinda Dark fragment](https://i.imgur.com/FjuZtgU.png)

![Makinda Dark full](https://i.imgur.com/7JKkS0D.png)

## Migrating from `makinda-dark`

The standalone `makindajack.makinda-dark` extension is deprecated as of `1.0.1`. Both themes are now bundled in `makindajack.makinda-themes`.

To migrate:

1. Install `makindajack.makinda-themes`.
2. Uninstall `makindajack.makinda-dark`.
3. Open the Color Theme picker and re-select **Makinda Dark**.

Your settings and theme preference will be preserved.

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Publishing Guide](docs/PUBLISHING.md)
- [Development](docs/DEVELOPMENT.md)

## Contributing

Contributions are welcome. Please read the [Contributing Guide](docs/CONTRIBUTING.md) before opening issues or pull requests.

## License

[MIT](LICENSE) © [Jackson Makinda](https://github.com/makindajack)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/makindajack">Jackson Makinda</a>
</div>
