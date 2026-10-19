# Property Search

A React + Vite + Tailwind starter for a property search experience.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`

## PropertySerch Field app (Android / iOS)

Field partners (Module 47) record the 10-minute location track at a property.
In a browser that only works while the page is open and the screen is on, so
the same site is also packaged as a native app with [Capacitor](https://capacitorjs.com)
and the MIT-licensed `@capacitor-community/background-geolocation` plugin: in
the app the track keeps running with the phone locked, shown by a
"Recording your visit" notification. The app opens on Dashboard → Work From
Home and talks to the live API (`VITE_API_BASE_URL`, default
`https://api.propertyserch.com/api`).

- App id `com.propertyserch.field`, name "PropertySerch Field" (`capacitor.config.json`).
- `npm run app:sync` - build the site and copy it into the native projects.
- `npm run app:android` - build, sync and open Android Studio; build the APK / AAB there
  (needs Android Studio with SDK 35 and JDK 21).
- Location permission is asked when a partner taps Start on a task. Android
  needs no "all the time" permission: a foreground service keeps the fixes coming.

### iOS (on a Mac with Xcode and CocoaPods)

1. `npx cap add ios` (the plugin needs CocoaPods; Swift Package Manager is not supported by it).
2. In `ios/App/App/Info.plist` add:
   - `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription`:
     "PropertySerch records your location while you are at a property for a field task."
   - `UIBackgroundModes` with the value `location`.
3. `npm run app:ios`, then build and sign in Xcode.

Every report carries where it came from (`android`, `ios` or `web`); reviewers
see it on the task in the CRM's Field Network page.
