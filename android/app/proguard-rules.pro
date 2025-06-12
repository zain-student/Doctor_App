# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# MMKV (required for MMKV to work in release builds)
-keep class com.facebook.hermes.** { *; }
-keep class com.tencent.mmkv.** { *; }
-keep class com.mrousavy.mmkv.** { *; }
-keep class com.reactnative.mmkv.** { *; }

# React Native safe-guards
-keep class com.facebook.react.** { *; }
-keep class com.facebook.soloader.** { *; }

# Keep JSON models if you're using them
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Keep class names for reflection
-keepclassmembers class ** {
   *;
}
