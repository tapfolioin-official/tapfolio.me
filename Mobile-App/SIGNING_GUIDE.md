# Google Play Signing & Keystore Guide

This guide details how release signing works for the Tapfolio Flutter project, how the keystore was generated, and how to maintain the credentials securely.

## Overview of App Signing

Google Play requires all uploaded App Bundles (`.aab`) or APKs to be signed with a digital release certificate. 

For the Tapfolio app, the signing configuration reads credentials from a local file named `key.properties` (which is excluded from Git to prevent leakage) and uses them to sign release builds using the keystore file.

---

## Keystore Creation Details

The release keystore was generated on **July 3, 2026** using the standard Java `keytool` utility.

### Keystore Metadata
*   **Filename:** `tapfolio-release.keystore`
*   **Location:** `mobile_app/android/` (Should be kept secure, never committed to git)
*   **Alias:** `tapfolio`
*   **Validity:** 10,000 days (expires November 18, 2053)
*   **Keystore Passwords:** (Refer to secure credentials manager / `key.properties`)

### Keystore SHA Fingerprints
The certificates generated are:
*   **SHA-1:** `30:E7:B8:B8:FF:BC:7E:08:D0:A6:65:42:CE:34:EE:ED:53:AF:15:4A`
*   **SHA-256:** `36:20:C7:A4:25:A5:71:4F:1B:DC:3E:C7:91:7D:55:F0:27:5C:C2:53:24:0A:B9:71:FA:6D:5E:C5:6C:0E:C3:1D`

> [!IMPORTANT]
> **Google Sign-In Configuration:**
> You must register both the SHA-1 and SHA-256 fingerprints in your Google Cloud Platform Console (under API Credentials -> OAuth Client ID for Android) and Firebase Console. Without registering these, Google SSO will fail on release builds.

---

## Restoring/Configuring credentials

To set up signing on a new developer machine or a CI/CD build runner:

1.  Place the `tapfolio-release.keystore` file inside the `mobile_app/android/` directory.
2.  Create `key.properties` inside the `mobile_app/android/` directory with the following contents:
    ```properties
    storePassword=tapfolio_store_2024
    keyPassword=tapfolio_store_2024
    keyAlias=tapfolio
    storeFile=../tapfolio-release.keystore
    ```

> [!CAUTION]
> Do NOT commit `key.properties` or `tapfolio-release.keystore` to your git repository. They are already listed in `.gitignore` to prevent accidental commits. Keep backups of these files in a secure vault. If you lose the keystore, you will not be able to push updates to the Play Store for this app ID.
