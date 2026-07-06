# ──────────────────────────────────────────────────────────────────────────────
# Flutter / Dart — keep all Flutter engine classes
# ──────────────────────────────────────────────────────────────────────────────
-keep class io.flutter.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.embedding.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.embedding.**

# ──────────────────────────────────────────────────────────────────────────────
# Google Sign-In
# ──────────────────────────────────────────────────────────────────────────────
-keep class com.google.android.gms.** { *; }
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.**

# ──────────────────────────────────────────────────────────────────────────────
# OkHttp / networking (used by http package internals)
# ──────────────────────────────────────────────────────────────────────────────
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# ──────────────────────────────────────────────────────────────────────────────
# SharedPreferences (Android data persistence)
# ──────────────────────────────────────────────────────────────────────────────
-keep class android.content.SharedPreferences { *; }

# ──────────────────────────────────────────────────────────────────────────────
# App Links / Deep Links
# ──────────────────────────────────────────────────────────────────────────────
-keep class nl.appsonfire.app_links.** { *; }
-dontwarn nl.appsonfire.app_links.**

# ──────────────────────────────────────────────────────────────────────────────
# Image Picker
# ──────────────────────────────────────────────────────────────────────────────
-keep class io.flutter.plugins.imagepicker.** { *; }

# ──────────────────────────────────────────────────────────────────────────────
# Package Info Plus
# ──────────────────────────────────────────────────────────────────────────────
-keep class dev.fluttercommunity.plus.packageinfo.** { *; }

# ──────────────────────────────────────────────────────────────────────────────
# URL Launcher
# ──────────────────────────────────────────────────────────────────────────────
-keep class io.flutter.plugins.urllauncher.** { *; }

# ──────────────────────────────────────────────────────────────────────────────
# Kotlin coroutines
# ──────────────────────────────────────────────────────────────────────────────
-keep class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# ──────────────────────────────────────────────────────────────────────────────
# Remove logging in release (strip debug print calls)
# ──────────────────────────────────────────────────────────────────────────────
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# ──────────────────────────────────────────────────────────────────────────────
# Preserve line numbers in stack traces for crash reporting
# ──────────────────────────────────────────────────────────────────────────────
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ──────────────────────────────────────────────────────────────────────────────
# Prevent R8 from removing crash-reporting annotations
# ──────────────────────────────────────────────────────────────────────────────
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
