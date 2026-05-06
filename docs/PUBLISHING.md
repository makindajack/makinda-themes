# Publishing Guide

This guide explains how to build and publish the Makinda Themes extension to the VS Code Marketplace.

## Prerequisites

### 1. Install vsce (Visual Studio Code Extension Manager)

```bash
npm install -g @vscode/vsce
```

### 2. Create a Publisher Account

1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Create a publisher if you don't have one (publisher ID: `makindajack`)

### 3. Create a Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Sign in with the same Microsoft account
3. Click on **User Settings** (gear icon) → **Personal access tokens**
4. Click **New Token**
5. Configure the token:
   - **Name**: `vsce-publishing` (or any name)
   - **Organization**: Select **All accessible organizations**
   - **Scopes**: Click **Custom defined**, then select:
     - **Marketplace** → **Manage**
   - **Expiration**: Set as needed (max 1 year)
6. Click **Create** and copy the token immediately (you won't see it again)

## Building the Extension

### Package the Extension

```bash
# Navigate to the extension directory
cd /Users/makindajack/Downloads/01.GitHub/makinda-themes

# Package the extension (creates .vsix file)
vsce package
```

This creates `makinda-themes-1.0.0.vsix` in the project root.

### Test the Package Locally

Before publishing, test the packaged extension:

```bash
# Install the .vsix file
code --install-extension makinda-themes-1.0.0.vsix
```

Then restart VS Code and activate the theme to verify everything works.

## Publishing to Marketplace

### Option 1: Publish Directly

```bash
# Login to vsce (you'll need your PAT)
vsce login makindajack

# Publish the extension
vsce publish
```

### Option 2: Publish with Version Bump

```bash
# Publish with automatic version bump
vsce publish minor  # Bumps 1.0.0 → 1.1.0
vsce publish patch  # Bumps 1.0.0 → 1.0.1
vsce publish major  # Bumps 1.0.0 → 2.0.0

# Or specify exact version
vsce publish 1.0.0
```

### Option 3: Upload Manually

1. Run `vsce package` to create the `.vsix` file
2. Go to [Marketplace Publisher Portal](https://marketplace.visualstudio.com/manage)
3. Click on your extension
4. Click **Update** and upload the `.vsix` file

## Post-Publishing Checklist

- [ ] Verify the extension appears on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes)
- [ ] Check that the README renders correctly
- [ ] Verify the icon and gallery banner display properly
- [ ] Test installation from the marketplace
- [ ] Create a GitHub release with the `.vsix` file
- [ ] Update the CHANGELOG.md for the next version cycle

## Updating the Extension

1. Make your changes to the theme
2. Update version in `package.json`
3. Update `CHANGELOG.md`
4. Run `vsce publish`

## Troubleshooting

### "Missing publisher name"

Ensure `package.json` has the correct publisher:

```json
"publisher": "makindajack"
```

### "Invalid token"

- Make sure you're using a PAT, not a password
- Verify the token has **Marketplace > Manage** permissions
- Check the token hasn't expired

### "Extension validation failed"

Run `vsce ls` to see which files will be included, and check for:

- Missing required fields in `package.json`
- Invalid JSON in theme files
- Missing icon file

## Useful Commands

```bash
# Show extension info
vsce show makindajack.makinda-themes

# List files that will be packaged
vsce ls

# Show package contents
vsce ls-publishers
```

## Resources

- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Manifest Reference](https://code.visualstudio.com/api/references/extension-manifest)
- [Marketplace Presentation Tips](https://code.visualstudio.com/api/references/extension-manifest#marketplace-presentation-tips)
