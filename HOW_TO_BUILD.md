# Wannas — How to Build for App Stores

## What's inside this zip
- `android/` → Full Android project (already has your app built-in)
- `ios/` → Full iOS project (already has your app built-in)
- `src/` → App source code
- `dist-cap/` → Pre-built web files (already synced into android/ and ios/)
- `codemagic.yaml` → Ready-to-use Codemagic CI/CD config

---

## How to use with Codemagic (recommended)

> The web app is **already pre-built** inside the android/ and ios/ folders.
> Codemagic does NOT need to run Vite or npm — it builds the native app directly.

### Step 1 — Push to GitHub
1. Create a new **private** GitHub repository named `wannas`
2. Upload all files from this zip to that repo
3. Make sure `android/`, `ios/`, and `dist-cap/` are all included (do NOT add them to .gitignore)

### Step 2 — Connect to Codemagic
1. Go to [codemagic.io](https://codemagic.io) and sign in with GitHub
2. Click **Add application** → select your `wannas` repo
3. Choose **"codemagic.yaml"** as the configuration type
4. Your two workflows will appear: **Wannas Android** and **Wannas iOS**

### Step 3 — Add signing credentials in Codemagic
**For Android:**
- Go to Teams → Code Signing → Android → upload your keystore file
- Name the reference `keystore_reference` (matches the yaml)

**For iOS:**
- Go to Teams → Code Signing → iOS → upload your Apple Distribution certificate + provisioning profile

### Step 4 — Run the build
- Click **Start build** on either workflow
- Android build takes ~5 minutes
- iOS build takes ~10 minutes
- Download the `.aab` or `.ipa` from the Artifacts tab

---

## Every time you update the app

1. Make changes in Replit (as usual)
2. Download a fresh zip from Replit
3. Replace ONLY the `android/` and `ios/` folders in your GitHub repo with the new ones
4. Commit & push to GitHub
5. Codemagic auto-builds (or click Start build manually)

> You do NOT need to re-run `npm install` or `vite build` on Codemagic — the built files are always included.

---

## Build locally instead (without Codemagic)

### Android — requires Android Studio
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS — requires Mac + Xcode
```bash
cd ios/App
pod install
open App.xcworkspace
# Then: Product → Archive → Distribute App
```

---

## App Store accounts you need

| Store | Link | Cost |
|---|---|---|
| Google Play Console | https://play.google.com/console | $25 one-time |
| Apple Developer | https://developer.apple.com | $99/year |
