# 懶人讀書會

<img src="./screenshots/video-lesson-xd.png" width="auto" height="400" />
<img src="./screenshots/landing-xd.png" width="auto" height="400" />
<img src="./screenshots/event-xd.png" width="auto" height="400" />

### Design

View Adobe XD mockup [here](https://xd.adobe.com/view/a7d832b4-0814-4d41-aa40-cca7486666c3-f28b/).

## Table of Contents

- [懶人讀書會](#懶人讀書會)
  - [Design](#design)
  - [Table of Contents](#table-of-contents)
  - [Quick start](#quick-start)
  - [Project Structure](#project-structure)
  - [Resources](#resources)

## Quick start

Follow the [installation guide](https://docs.expo.dev/get-started/installation/) and install Expo CLI.

```sh
cd book-club-app
yarn
cd ios && pod install   # For iOS
yarn start
```

### Running on Devices

Plug in your device via USB and set up as [here](https://reactnative.dev/docs/running-on-device).

For Android:

```sh
adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Physical device

yarn run-android

# Connect to development server
adb -s <device name> reverse tcp:8081 tcp:8081
```

```sh
cd android
./gradlew clean
```

## Project Structure

```
book-club-app/
├── assets
├── src
  ├── components
  │   ├── IconButton.tsx
  │   └── TabBar.tsx
  ├── constants
  │   ├── events.ts
  │   ├── lessons.ts
  │   └── media.ts
  ├── navigation
  │   ├── BottomTabNavigator.tsx
  │   ├── index.tsx
  │   ├── Routes.ts
  │   └── ScreenOptions.ts
  ├── screens
  │   ├── account
  │   ├── auth
  │   ├── event
  │   ├── home
  │   ├── lesson
  │   ├── news
  │   └── NotFoundScreen.tsx
  ├── store
  ├── styles
  │   ├── Theme.ts
  │   ├── Colors.ts
  │   └── Layout.ts
  ├── typings
  │   └── navigation.ts
  └── utils
      └── i18n.ts
├── app.json
├── App.tsx
├── AppCore.tsx
├── README.md
├── package.json
├── babel.config.js
└── tsconfig.json
```

## Deep Linking

There are 2 types of deep link from redirect:

- Referral link
- Reset password link from email
- Event page

To test deep linking, run the following:

```sh
npx uri-scheme open [your deep link] --[ios|android]

# examples
npx uri-scheme open "booktvhk://redeem?code=26528" --ios
npx uri-scheme open "booktvhk://invite?code=41620" --ios
npx uri-scheme open "booktvhk://reset-password?code=98765" --android
npx uri-scheme open "booktvhk://event/1" --ios
npx uri-scheme open "booktvhk://lesson/2" --ios
```

or use platform-specific command:

```sh
# iOS xcrun
xcrun simctl openurl booted booktvhk://invite

# Android adb
adb shell am start -W -a android.intent.action.VIEW -d "booktvhk://invite?code=98765" com.booktvhk
```

## Resources

- NativeBase Theme: <https://docs.nativebase.io/default-theme>
- React Navigation: <https://reactnavigation.org/docs/5.x/getting-started>
- Icon list: https://icons.expo.fyi/

## Credit

<a href="https://www.flaticon.com/free-icons/storytelling" title="storytelling icons">Storytelling icons created by Freepik - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/magic" title="magic icons">Magic icons created by Freepik - Flaticon</a>

## Issues / Bugs

The error `Couldn't find a navigation context.` occurs when remote debugging is on.

- [Expo Ref usage and Navigation Container Conflicting](https://stackoverflow.com/questions/62881005/expo-ref-usage-and-navigation-container-conflicting)
- [ViewPropTypes will be removed from React Native](https://github.com/meliorence/react-native-snap-carousel/issues/954)
  - Deprecated `ViewPropTypes` from `react-native-snap-carousel` stops app from running. Hence, beta version is used to remove issue

## Steps

Android Only

Get SHA certificate fingerprints for Firebase

```sh
`keytool -list -v \ -alias booktv -keystore booktv-keystore`
```

Get Key hashes for Facebook Login

```sh
keytool -exportcert -alias booktv -keystore booktv-keystore | openssl sha1 -binary | openssl base64
```
