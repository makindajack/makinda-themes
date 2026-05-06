# Publishing Runbook

This is the per-release workflow for shipping **Makinda Themes** to every marketplace it lives on. Follow it top-to-bottom for any new version.

If this is your first time, read [§ One-time setup](#one-time-setup) first to create accounts, generate tokens, and seed first-time-only marketplace listings. Subsequent releases skip straight to [§ Per-release workflow](#per-release-workflow).

---

## Where the themes live

| Tier | Marketplace                                                                                                              | Mechanism                                                                                    | First time          | Updates                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------- |
| 1    | **VS Code Marketplace**                                                                                                  | `vsce publish`                                                                               | publisher account   | seconds                                                  |
| 1    | **Open VSX** (VSCodium / Cursor / Windsurf)                                                                              | `ovsx publish`                                                                               | namespace claim     | seconds                                                  |
| 1    | **JetBrains Marketplace**                                                                                                | `gradle publishPlugin`                                                                       | manual zip upload   | minutes                                                  |
| 2    | **Sublime Package Control**                                                                                              | PR to `sublimehq/package_control_channel`                                                    | one PR              | tag a new release                                        |
| 2    | **Obsidian community themes**                                                                                            | PR to `obsidianmd/obsidian-releases`                                                         | one PR              | tag a new release                                        |
| 2    | **Zed extensions**                                                                                                       | PR to `zed-industries/extensions`                                                            | one PR + CLA        | bump submodule + version                                 |
| 3    | **BetterDiscord**                                                                                                        | Web upload at <https://betterdiscord.app/developers>                                         | account             | manual upload                                            |
| 3    | **Visual Studio Marketplace** (full VS)                                                                                  | Web upload                                                                                   | publisher account   | manual upload                                            |
| 3    | **Eclipse Marketplace**                                                                                                  | Web form                                                                                     | account             | manual upload                                            |
| 3    | **Nova Extensions**                                                                                                      | `nova extension publish`                                                                     | Panic ID + Nova app | CLI                                                      |
| —    | **Terminals** (Alacritty, Kitty, Warp, iTerm2, WezTerm, Ghostty, Windows Terminal, Helix, Lapce)                         | No marketplace                                                                               | n/a                 | committed in [ports/](../ports) — users pull from GitHub |
| —    | **Other** (Slack, Emacs, Neovim, Xcode, TextMate, BBEdit, Notepad++, Eclipse EPF, Discord, Visual Studio settings, Nova) | Distributed via the [GitHub release](https://github.com/makindajack/makinda-themes/releases) | n/a                 | re-tag the release                                       |

The repos that anchor the marketplace listings:

| Repo                                                                            | Marketplace                           |
| ------------------------------------------------------------------------------- | ------------------------------------- |
| [makindajack/makinda-themes](https://github.com/makindajack/makinda-themes)     | source-of-truth + VS Code + JetBrains |
| [makindajack/makinda-sublime](https://github.com/makindajack/makinda-sublime)   | Package Control                       |
| [makindajack/makinda-obsidian](https://github.com/makindajack/makinda-obsidian) | Obsidian themes                       |
| [makindajack/makinda-zed](https://github.com/makindajack/makinda-zed)           | Zed extensions                        |

> ⚠️ The standalone repos exist because Package Control, Obsidian, and Zed each require the manifest at the **root of a dedicated repo**. Don't merge them back into the monorepo.

---

## One-time setup

Skip if you've published before.

### Tokens

Generate each token once, then store in your password manager. **Never commit a token. Never paste a token into a file in this repo.**

#### `VSCE_PAT` — VS Code Marketplace

1. <https://dev.azure.com> → sign in with the Microsoft account that owns the `makindajack` Marketplace publisher.
2. Avatar → **Personal access tokens** → **+ New Token**.
3. Name `vsce-publish-makinda-themes`, **Organization: All accessible organizations**, expiration 1 year.
4. **Custom defined** scopes → **Marketplace → Manage**.
5. Create. Copy once.
6. Verify the publisher exists at <https://marketplace.visualstudio.com/manage/publishers/makindajack>.

#### `OVSX_PAT` — Open VSX

1. <https://open-vsx.org> → sign in with GitHub (`makindajack`).
2. Avatar → **Settings → Namespaces** → claim `makindajack`.
3. **Settings → Access Tokens** → **Generate New Token** → copy once.

#### `JETBRAINS_PUBLISH_TOKEN` — JetBrains Marketplace

1. <https://plugins.jetbrains.com> → sign in.
2. **First time only:** upload `ports/jetbrains/build/distributions/makinda-themes-<version>.zip` at <https://plugins.jetbrains.com/plugin/add>. Category **UI → Themes**, license MIT. The plugin enters moderation; tokens work even before approval.
3. <https://plugins.jetbrains.com/author/me/tokens> → **Generate Token** → name `gradle-publish-makinda-themes` → permanent → copy once.

### First-time marketplace submissions (Tier 2)

Submit each PR once. After it merges, future versions are picked up automatically by tagging a new GitHub release on the standalone repo.

- **Sublime:** add an entry under `Makinda` in `repository/m.json` of `sublimehq/package_control_channel`. PR template: see [#9409](https://github.com/sublimehq/package_control_channel/pull/9409).
- **Obsidian:** append to `community-css-themes.json` of `obsidianmd/obsidian-releases`. PR template: see [#12586](https://github.com/obsidianmd/obsidian-releases/pull/12586). Repo must contain `manifest.json`, `theme.css`, and `screenshot.png` at root, with a tag matching the manifest version (no `v` prefix).
- **Zed:** add as a git submodule in `extensions/<id>/` plus an entry in `extensions.toml` of `zed-industries/extensions`. Sign the [Zed CLA](https://zed.dev/cla) before opening the PR. PR template: see [#5924](https://github.com/zed-industries/extensions/pull/5924). Use a verified email on your GitHub account when committing — the CLA bot rejects unrecognized identities.

### Tier-3 first-time submissions (manual, when ready)

These are out of scope for the automated runbook below. Each is a manual web flow:

- **BetterDiscord** — upload `ports/discord/Makinda Light.theme.css` and `Makinda Dark.theme.css` at <https://betterdiscord.app/developers>.
- **Visual Studio (full)** — upload at <https://marketplace.visualstudio.com/manage/publishers/makindajack>. Note: full VS doesn't natively consume VS Code-style themes; ship `ports/visual-studio/*.vssettings` as a downloadable asset.
- **Eclipse Marketplace** — listing form at <https://marketplace.eclipse.org/user/login>.
- **Nova Extensions** — `cd ports/nova/Makinda.novaextension && nova extension publish` (requires Nova app + Panic ID).

---

## Per-release workflow

Run from the repo root unless noted. Replace `1.0.3` with the new version everywhere.

### 1. Decide the version

Use [Semantic Versioning](https://semver.org):

- **Patch** (`1.0.x`) — palette tweaks, contrast fixes, doc/screenshot updates.
- **Minor** (`1.x.0`) — new IDE port, new semantic-token coverage, new editor features.
- **Major** (`x.0.0`) — breaking palette changes (anyone with their own overrides will see different colors).

### 2. Bump versions in lockstep

Three places must agree:

```bash
# Edit by hand or with sed:
NEW=1.0.3

# 1. VS Code extension
sed -i '' "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW\"/" package.json

# 2. JetBrains plugin
sed -i '' "s/version = \"[0-9.]*\"/version = \"$NEW\"/" ports/jetbrains/build.gradle.kts

# 3. Obsidian theme
sed -i '' "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW\"/" ports/obsidian/manifest.json

# Sublime + Zed standalone repos: edited inside their own repos in step 7.
```

### 3. Update CHANGELOG.md

Add a new section at the top under `## [Unreleased]` (or directly as `## [1.0.3] - YYYY-MM-DD`). Follow [Keep a Changelog](https://keepachangelog.com): group by `Added` / `Changed` / `Fixed` / `Removed` / `Documentation`.

### 4. Build everything

```bash
npm run build         # regenerates every editor port from source/
npm run check         # validate + WCAG contrast audit (must pass)
npm run screenshots   # only if the palette or themes changed
```

### 5. Package distributables

```bash
npx --yes @vscode/vsce package
# → makinda-themes-<version>.vsix

cd ports/jetbrains && ./gradlew --no-daemon buildPlugin && cd -
# → ports/jetbrains/build/distributions/makinda-themes-<version>.zip
```

### 6. Commit, tag, push, GitHub release

```bash
git add -A
git commit -m "Release $NEW: <one-line summary>"
git tag v$NEW
git push origin master
git push origin v$NEW

gh release create v$NEW \
  makinda-themes-$NEW.vsix \
  ports/jetbrains/build/distributions/makinda-themes-$NEW.zip \
  --title "v$NEW" \
  --notes-file <(awk "/^## \[$NEW\]/,/^## \[/{if(/^## \[/ && !/$NEW/) exit; print}" CHANGELOG.md)
```

### 7. Push to the standalone marketplace repos

These mirror specific files from `ports/<editor>/` into single-purpose repos that the marketplaces consume.

```bash
NEW=1.0.3
ROOT=$(pwd)
WORK=/tmp/makinda-publish
mkdir -p $WORK && cd $WORK

# --- Sublime ---
git clone git@github.com:makindajack/makinda-sublime.git
cd makinda-sublime
rm -f *.sublime-color-scheme messages.json package.json README.md
rm -rf messages
cp -r $ROOT/ports/sublime/. .
sed -i '' "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW\"/" package.json
git add -A
git commit -m "Release $NEW"
git tag v$NEW
git push origin main
git push origin v$NEW
cd ..

# --- Obsidian ---
git clone git@github.com:makindajack/makinda-obsidian.git
cd makinda-obsidian
cp $ROOT/ports/obsidian/manifest.json $ROOT/ports/obsidian/theme.css .
# Refresh screenshot if themes changed:
cp $ROOT/images/dark-markdown.png screenshot.png
git add -A
git commit -m "Release $NEW"
git tag $NEW          # ⚠️ Obsidian forbids the 'v' prefix
git push origin main
git push origin $NEW
gh release create $NEW manifest.json theme.css \
  --repo makindajack/makinda-obsidian \
  --title "$NEW" \
  --notes "Release $NEW"
cd ..

# --- Zed ---
git clone git@github.com:makindajack/makinda-zed.git
cd makinda-zed
rm -rf themes README.md extension.toml
cp -r $ROOT/ports/zed/. .
sed -i '' "s/version = \"[0-9.]*\"/version = \"$NEW\"/" extension.toml
git add -A
git commit -m "Release $NEW"
git tag v$NEW
git push origin main
git push origin v$NEW
cd ..
```

### 8. Publish to Tier 1 marketplaces

Tokens are read from env vars — never hardcode them, never commit them.

```bash
export VSCE_PAT=...
export OVSX_PAT=...
export JETBRAINS_PUBLISH_TOKEN=...

# VS Code Marketplace
npx --yes @vscode/vsce publish --pat "$VSCE_PAT"

# Open VSX
npx --yes ovsx publish makinda-themes-$NEW.vsix -p "$OVSX_PAT"

# JetBrains Marketplace
( cd ports/jetbrains && ./gradlew --no-daemon publishPlugin )
```

### 9. Bump the marketplace registry PRs (Tier 2)

Tier 2 marketplaces auto-pick-up new tags from the standalone repos **after** the initial PR has merged. Sequence per marketplace:

- **Sublime Package Control** — nothing to do; Package Control polls tags on the registered repo. Users get `$NEW` next refresh cycle.
- **Obsidian** — nothing to do; Obsidian polls the GitHub releases of the registered repo. Users see `$NEW` after the next index rebuild (~hours).
- **Zed** — open a follow-up PR to `zed-industries/extensions` that bumps the submodule pointer and the `version` field in `extensions.toml`:

  ```bash
  cd /tmp/makinda-publish
  rm -rf zed-extensions
  git clone --depth 1 git@github.com:makindajack/extensions.git zed-extensions
  cd zed-extensions
  git remote add upstream https://github.com/zed-industries/extensions.git
  git fetch upstream main --depth 1
  git checkout -B bump-makinda-$NEW upstream/main
  cd extensions/makinda-themes
  git fetch && git checkout v$NEW
  cd ../..
  sed -i '' "/^\[makinda-themes\]/,/^$/ s/version = \"[0-9.]*\"/version = \"$NEW\"/" extensions.toml
  git -c user.email=22730819+makindajack@users.noreply.github.com \
      -c user.name=makindajack \
      commit -am "Bump makinda-themes to $NEW"
  git push -u origin bump-makinda-$NEW
  gh pr create --repo zed-industries/extensions \
    --base main --head makindajack:bump-makinda-$NEW \
    --title "Bump makinda-themes to $NEW" \
    --body "Bumps the submodule pointer and \`version\` in \`extensions.toml\`."
  ```

### 10. Tier 3 (manual)

Reupload the relevant artifacts to the web portals listed in [§ One-time setup → Tier-3 first-time submissions](#tier-3-first-time-submissions-manual-when-ready). Do these last; they're rarely time-critical.

### 11. Post-release verification

- [ ] <https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes> shows `$NEW` (cache can take ~5 min)
- [ ] <https://open-vsx.org/extension/makindajack/makinda-themes> shows `$NEW`
- [ ] <https://plugins.jetbrains.com/plugin/me> JetBrains listing shows `$NEW` (after moderation)
- [ ] [GitHub release](https://github.com/makindajack/makinda-themes/releases) page shows `$NEW` with both artifacts attached
- [ ] Both standalone repos show `$NEW` tags
- [ ] Tier-2 PRs merged or pending

---

## Token rotation

Rotate any token that's ever been:

- pasted into a chat or screen recording,
- committed to a repo (even briefly — assume Git history is forever),
- copied to a machine you no longer control.

Quickest way to rotate:

- **VSCE_PAT** — <https://dev.azure.com> → avatar → Personal access tokens → revoke + new.
- **OVSX_PAT** — <https://open-vsx.org> → Settings → Access Tokens → delete + generate.
- **JETBRAINS_PUBLISH_TOKEN** — <https://plugins.jetbrains.com/author/me/tokens> → revoke + generate.

---

## Troubleshooting

### `vsce publish` returns `401 Unauthorized`

Your PAT's organization scope is wrong. Re-create at <https://dev.azure.com> with **Organization: All accessible organizations**, not a single one.

### `ovsx publish` says "namespace not owned"

You haven't claimed the `makindajack` namespace at <https://open-vsx.org/user-settings/namespaces>.

### `gradle publishPlugin` says `404 Not Found`

The plugin listing doesn't exist yet on JetBrains Marketplace. Do the one-time manual upload at <https://plugins.jetbrains.com/plugin/add> first.

### CLA bot rejects "unparseable identity"

Your commit's `git config user.email` isn't on file at <https://github.com/settings/emails>. Re-author with your GitHub noreply email:

```bash
git -c user.email=22730819+makindajack@users.noreply.github.com \
    -c user.name=makindajack \
    commit --amend --reset-author --no-edit
git push -f
```

Then comment `@cla-bot check` on the PR.

### Obsidian PR rejected for "missing screenshot"

Their validator requires `screenshot.png` at the **root** of `makindajack/makinda-obsidian`, and the manifest version (no `v` prefix) must be the latest GitHub release tag with `manifest.json` and `theme.css` attached as assets.

### Package Control still shows the old version

Package Control polls tags every few hours. Confirm your new tag exists at <https://github.com/makindajack/makinda-sublime/tags> and wait. There's no faster path.

---

## Useful commands

```bash
# What will be packaged into the .vsix?
npx --yes @vscode/vsce ls

# Show extension info on the Marketplace
npx --yes @vscode/vsce show makindajack.makinda-themes

# Open every marketplace listing in a browser
open https://marketplace.visualstudio.com/items?itemName=makindajack.makinda-themes
open https://open-vsx.org/extension/makindajack/makinda-themes
open https://plugins.jetbrains.com/plugin/me
open https://packagecontrol.io/packages/Makinda%20Themes
open https://github.com/makindajack/makinda-themes/releases
```

---

## Resources

- [VS Code — Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Open VSX — Publishing](https://github.com/EclipseFdn/open-vsx.org/wiki/Publishing-Extensions)
- [JetBrains — Publishing Plugins](https://plugins.jetbrains.com/docs/intellij/publishing-plugin.html)
- [Package Control — Submitting a Package](https://packagecontrol.io/docs/submitting_a_package)
- [Obsidian — Submit a theme](https://docs.obsidian.md/Themes/App+themes/Submit+your+theme)
- [Zed — Developing Extensions](https://zed.dev/docs/extensions/developing-extensions)
