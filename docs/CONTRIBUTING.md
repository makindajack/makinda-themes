# Contributing to Makinda Themes

Thank you for your interest in contributing to Makinda Themes! This document provides guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check [existing issues](https://github.com/makindajack/makinda-themes/issues) to avoid duplicates
2. Open a new issue with a clear title and description
3. Include:
   - VS Code version
   - Extension version
   - Screenshots (if applicable)
   - Steps to reproduce (for bugs)

### Suggesting Enhancements

For feature requests or color adjustments:

1. Open an issue with the `enhancement` label
2. Describe the change and why it would be beneficial
3. Include screenshots or mockups if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test the theme thoroughly
5. Commit with clear messages: `git commit -m "Add: description of change"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup instructions.

### Quick Start

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/makinda-themes.git
cd makinda-themes

# Open in VS Code
code .

# Press F5 to launch Extension Development Host
```

## Style Guidelines

### Theme Colors

When proposing color changes:

- Maintain consistency with the brand palette
- Ensure sufficient contrast for readability (WCAG AA minimum)
- Test colors in multiple file types and scenarios
- Document the reasoning for color choices

### Color Palette Reference

| Category      | Color     | Hex       |
| ------------- | --------- | --------- |
| Brand Orange  | Primary   | `#e65800` |
| Brand Orange  | Dark      | `#b34400` |
| Brand Orange  | Light     | `#ff711a` |
| Accent Purple | Primary   | `#6b26c0` |
| Accent Purple | Dark      | `#7231bf` |
| Background    | Editor    | `#ffffff` |
| Background    | Sidebar   | `#fafafa` |
| Text          | Primary   | `#27272a` |
| Text          | Secondary | `#71717a` |

### Commit Messages

Use clear, descriptive commit messages:

```
Add: new feature or functionality
Fix: bug fix
Update: changes to existing features
Docs: documentation changes
Style: formatting, no code change
Refactor: code restructuring
```

## Testing

Before submitting a PR:

1. Test with various programming languages:
   - JavaScript/TypeScript
   - Python
   - HTML/CSS
   - JSON
   - Markdown

2. Verify UI elements:
   - Sidebar and activity bar
   - Tabs and editor groups
   - Status bar states
   - Integrated terminal
   - Search results
   - Git decorations

3. Check for accessibility:
   - Text readability
   - Color contrast
   - Focus states

## Questions?

Feel free to open an issue or reach out to [Jackson Makinda](https://github.com/makindajack).
