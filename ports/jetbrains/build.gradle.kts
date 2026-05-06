plugins {
    id("java")
    id("org.jetbrains.intellij") version "1.17.4"
}

group = "com.makindajack"
version = "1.0.3"

repositories {
    mavenCentral()
}

// Configure the gradle-intellij-plugin. Themes are platform-version agnostic;
// targeting a recent stable IC build is fine and gives us the broadest support.
intellij {
    version.set("2024.1")
    type.set("IC") // IntelliJ IDEA Community
    plugins.set(listOf<String>())
}

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "17"
        targetCompatibility = "17"
    }

    patchPluginXml {
        sinceBuild.set("223")
        untilBuild.set("") // No upper bound — themes are forward-compatible.
    }

    // Token comes from the JETBRAINS_PUBLISH_TOKEN env var.
    publishPlugin {
        token.set(System.getenv("JETBRAINS_PUBLISH_TOKEN"))
    }
}
