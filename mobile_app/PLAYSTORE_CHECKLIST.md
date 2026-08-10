# Google Play Console Submission Checklist

Use this checklist to track all the steps required before promoting the Tapfolio app to the Production track on Google Play.

## Technical Configuration
- [x] Application ID verified (`com.tapfolio.app`).
- [x] Minimum SDK configured (API 21+).
- [x] Target SDK configured (API 35/Android 15 compatibility).
- [x] Multidex support enabled in Gradle.
- [x] Production release signing configured (keystore & key.properties).
- [x] R8 Code Shrinking and Resource Shrinking enabled.
- [x] ProGuard Keep Rules configured (`proguard-rules.pro`).
- [x] App label verified as "Tapfolio" in manifest.
- [x] Adaptive & themed launcher icons generated and verified.
- [x] Splash Screen branded theme (`Theme.SplashScreen` styles) verified.
- [x] Network Security Configuration (HTTPS-only) enforced.
- [x] Android 12+ backup & data extraction rules defined.
- [x] Default debug/mock Google Sign-in dialogs completely removed from production screens.
- [x] Zero warnings or lint issues in `flutter analyze`.
- [x] All unit/widget tests passing successfully.

## Policies & Compliance
- [x] Privacy Policy published at `https://tapfolio.me/privacy`.
- [x] Terms of Service published at `https://tapfolio.me/terms`.
- [x] In-app account deletion flow implemented (Delete Account screen).
- [x] Data Safety questionnaire answers generated (see `docs/DATA_SAFETY.md`).
- [ ] Google Play Console Account Deletion Declaration filled out (pointing to `https://tapfolio.me/privacy` and details of account deletion).

## OAuth & Third Party Consoles
- [ ] Production SHA-1 certificate registered in Google Cloud Console OAuth Client settings for Google Sign-In.
- [ ] Production SHA-256 certificate registered in Google Cloud Console OAuth Client settings.
- [ ] Firebase credentials or Google API JSON file generated for release builds.

## Store Listing Assets
- [ ] App Name: **Tapfolio**
- [ ] Short Description: **Smart NFC Professional Profiles & Digital Business Cards**
- [ ] Full Description: (Write full description including NFC card integration, social link sharing, and connections log).
- [ ] Launcher Icon: 512x512 PNG, transparent, no rounded corners.
- [ ] Feature Graphic: 1024x500 PNG.
- [ ] Phone Screenshots: At least 2, maximum 8 (16:9 or 9:16 aspect ratio).
- [ ] 7-inch Tablet Screenshots: At least 2.
- [ ] 10-inch Tablet Screenshots: At least 2.
- [ ] Contact Email: `tapfolio.in@gmail.com`
