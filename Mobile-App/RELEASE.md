# Tapfolio Release Documentation

This document describes how to build, test, and release the Tapfolio Flutter mobile application.

## Version Management

The versioning details are controlled in the `pubspec.yaml` file:
```yaml
version: 1.1.0+2
```
*   `1.1.0` is the **Version Name** (visible to users on the Google Play Store).
*   `2` is the **Version Code** (an integer incremented on every upload to the Play Console).

### Version Bump Procedure
To update the version for a new release:
1.  Open `mobile_app/pubspec.yaml`.
2.  Increment the version name and/or code (e.g., `version: 1.1.1+3`).
3.  Run `flutter pub get` to sync the build configurations.

---

## Release Building

To build the release-ready Android App Bundle (`.aab`) to upload to Google Play Console:

1.  Ensure you have the `key.properties` file located at `mobile_app/android/key.properties` with the following parameters:
    ```properties
    storePassword=YOUR_KEYSTORE_PASSWORD
    keyPassword=YOUR_KEY_PASSWORD
    keyAlias=tapfolio
    storeFile=../tapfolio-release.keystore
    ```
2.  Ensure `tapfolio-release.keystore` is placed in `mobile_app/android/`.
3.  Run the following build command:
    ```bash
    flutter build appbundle --release
    ```
4.  The generated release app bundle will be placed at:
    `mobile_app/build/app/outputs/bundle/release/app-release.aab`

---

## Code shrinking and Obfuscation

The build configuration in `android/app/build.gradle.kts` uses R8 optimizations for code shrinking and resource shrinking:
```kotlin
isMinifyEnabled = true
isShrinkResources = true
```
This is configured with explicit ProGuard keep rules defined in `android/app/proguard-rules.pro` to keep reflection classes (like Dart HTTP, SharedPreferences, Google Sign-In SDK, etc.) safe.

To obfuscate Dart code as well, you can run:
```bash
flutter build appbundle --release --obfuscate --split-debug-info=./build/app/outputs/symbols
```
This reduces the file size further and prevents reverse engineering of Dart code logic.
