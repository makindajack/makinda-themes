# Makinda Themes — JetBrains plugin

This is the JetBrains port of [Makinda Themes](../../README.md). It ships **Makinda Light** and **Makinda Dark** as a single plugin compatible with every IntelliJ-based IDE: IntelliJ IDEA, WebStorm, PyCharm, GoLand, RustRover, Rider, PhpStorm, RubyMine, Android Studio, etc.

## Layout

```
ports/jetbrains/
├── build.gradle.kts                # gradle-intellij-plugin scaffold
├── settings.gradle.kts
├── gradle.properties
└── src/main/resources/
    ├── META-INF/
    │   └── plugin.xml              # plugin manifest, registers both themes
    └── themes/                     # GENERATED — do not edit by hand
        ├── makinda-light.theme.json
        ├── makinda-light.icls
        ├── makinda-dark.theme.json
        └── makinda-dark.icls
```

The two `.theme.json` and two `.icls` files are produced by `build/jetbrains.mjs` from `source/palette.json`. Run `npm run build` (or `npm run build:jetbrains`) at the repo root to regenerate them whenever the palette changes.

## Develop locally

Requires JDK 17+ and Gradle (the wrapper will be added on first build with `gradle wrapper`).

```bash
cd ports/jetbrains

# First-time only — generate the Gradle wrapper.
gradle wrapper --gradle-version 8.10

# Launch a sandbox IntelliJ with the plugin installed.
./gradlew runIde
```

The first run downloads the IntelliJ Community IDE (~1 GB) into Gradle's cache. Subsequent runs reuse it.

In the sandbox IDE: `Settings → Appearance & Behavior → Appearance → Theme` and pick **Makinda Light** or **Makinda Dark**.

## Build a distributable

```bash
./gradlew buildPlugin
# → build/distributions/makinda-themes-<version>.zip
```

That `.zip` is the artifact you upload to the JetBrains Marketplace, or share for "Install plugin from disk".

## Publish

```bash
export JETBRAINS_PUBLISH_TOKEN=<token from https://plugins.jetbrains.com/author/me/tokens>
./gradlew publishPlugin
```

## Status

- [x] `.theme.json` + `.icls` generators
- [x] Gradle scaffold + `plugin.xml` registering both themes
- [ ] Manual smoke-test in IntelliJ IDEA, WebStorm, PyCharm, GoLand, RustRover, Rider, Android Studio
- [ ] First submission to the JetBrains Marketplace
