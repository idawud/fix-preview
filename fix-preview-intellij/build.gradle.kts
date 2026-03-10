plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "1.9.10"
    id("org.jetbrains.intellij.platform") version "2.0.0"
}

group = "com.antigravity"
version = "1.0.0"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        intellijIdeaCommunity("2023.2.5")
    }
}

intellijPlatform {
    pluginConfiguration {
        id = "com.antigravity.fixpreview"
        name = "FIX Preview"
        version = "1.0.0"
    }
}
