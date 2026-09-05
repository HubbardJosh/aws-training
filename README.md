# AWS Certification Study App

A mobile-first study app for AWS certification exam prep, built with Expo and React Native. Supports multiple certifications with flashcards, practice quizzes, detailed service guides, and progress tracking — all stored locally on your device.

---

## Certifications Covered

| Cert        | Name                                     | Questions | Time    | Passing Score |
| ----------- | ---------------------------------------- | --------- | ------- | ------------- |
| **DVA-C02** | AWS Certified Developer – Associate      | 65        | 130 min | 720/1000      |
| **CLF-C02** | AWS Certified Cloud Practitioner         | 65        | 90 min  | 700/1000      |
| **AIF-C01** | AWS Certified AI Practitioner            | 85        | 120 min | 700/1000      |
| **MLS-C01** | AWS Certified Machine Learning Specialty | 65        | 180 min | 750/1000      |

---

## Features

- **Flashcards** — Spaced repetition study with difficulty tracking and domain filtering
- **Practice Quizzes** — Timed exams with single and multi-choice questions, instant feedback, and detailed answer explanations
- **Study Guides** — In-depth service guides with code examples and syntax highlighting
- **Progress Tracking** — Domain-by-domain accuracy breakdown, streak counting, and session history
- **Missed Questions Review** — Automatically surfaces questions you got wrong for targeted review
- **Sources** — Links to official AWS documentation for every guide topic
- **Dark / Light Mode** — Follows system preference or can be set manually
- **Abbreviation Tooltips** — Tap any AWS acronym (DLQ, ECS, IAM, etc.) for an inline definition

---

## Tech Stack

| Layer             | Technology                                       |
| ----------------- | ------------------------------------------------ |
| Framework         | Expo 54 (managed workflow)                       |
| Language          | TypeScript 5.9                                   |
| UI Runtime        | React Native 0.81 / React 19                     |
| Navigation        | React Navigation v7 (bottom tabs + native stack) |
| Storage           | AsyncStorage (local, persistent)                 |
| State             | React Context API                                |
| Icons             | @expo/vector-icons (Ionicons)                    |
| Code Highlighting | react-native-code-highlighter                    |
| Gradients         | Expo Linear Gradient                             |

---

## Project Structure

```
aws-training/
├── src/
│   ├── data/               # All certification content
│   │   ├── dva/            # DVA-C02 flashcards, quiz questions, guides
│   │   ├── clf/            # CLF-C02 content
│   │   ├── aif/            # AIF-C01 content
│   │   └── mls/            # MLS-C01 content
│   ├── screens/            # 12 screen components
│   ├── navigation/         # Bottom tab + stack navigator setup
│   ├── context/            # CertContext, ThemeContext
│   ├── components/         # Shared UI components
│   ├── hooks/              # useCertData and other custom hooks
│   ├── utils/              # Storage helpers, theme utilities
│   └── types/              # TypeScript type definitions
├── assets/                 # App icon, splash screen
├── App.tsx                 # Root component
├── app.json                # Expo configuration
└── package.json
```

Each certification folder contains:

- `flashcards.ts` — 100+ flashcards tagged by domain, difficulty, and service
- `quizQuestions.ts` — 100+ quiz questions with explanations for every answer option
- `abbreviations.ts` — Service acronym definitions for tooltip expansion
- `guides/` — 20–33 detailed service guides (e.g. Lambda, S3, DynamoDB, IAM)

---

## Installation & Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) (comes with Node)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) — install globally if not already present:

```bash
npm install -g expo-cli
```

### Clone and install

```bash
git clone https://github.com/<your-username>/aws-training.git
cd aws-training
npm install
```

### Start the development server

```bash
npm start
```

This opens the Expo dev server. From there you can:

- Press `i` to open in the iOS Simulator (requires Xcode on macOS)
- Press `a` to open in the Android Emulator (requires Android Studio)
- Press `w` to open in a browser (React Native Web)
- Scan the QR code with the **Expo Go** app on your physical device

---

## Installing on Your Device (No App Store Required)

### Option 1 — Expo Go (quickest, development builds only)

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android).
2. Run `npm start` in the project directory.
3. Scan the QR code shown in your terminal with the Expo Go app (Android) or your Camera app (iOS).
4. The app loads instantly — no build step required.

> **Note:** Expo Go works great for development and personal use. The app runs inside the Expo Go container rather than as a standalone app on your home screen.

### Option 2 — Standalone build via EAS (installs as a real app)

This produces a native `.ipa` (iOS) or `.apk`/`.aab` (Android) that installs directly on your device like any other app.

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Log in to your Expo account (create one free at expo.dev if needed):

```bash
eas login
```

3. Configure the build (first time only):

```bash
eas build:configure
```

4. Build for your platform:

```bash
# iOS (requires Apple Developer account for device distribution)
eas build --platform ios --profile preview

# Android (generates a shareable .apk)
eas build --platform android --profile preview
```

5. Once the build completes, EAS provides a QR code or download link. On Android, open the link on your device and install the `.apk`. On iOS, the build can be installed via TestFlight or by registering your device's UDID in your Apple Developer account.

### Option 3 — Local iOS build (macOS + Xcode only)

```bash
npx expo run:ios
```

This compiles and installs the app directly to a connected iPhone or the iOS Simulator without going through EAS.

### Option 4 — Local Android build (requires Android Studio)

```bash
npx expo run:android
```

Compiles and installs directly to a connected Android device or emulator.

---

## Available Scripts

| Script           | Command           | Description                        |
| ---------------- | ----------------- | ---------------------------------- |
| Start dev server | `npm start`       | Opens Expo dev server with QR code |
| iOS simulator    | `npm run ios`     | Launches app in iOS Simulator      |
| Android emulator | `npm run android` | Launches app in Android Emulator   |
| Web              | `npm run web`     | Opens app in browser               |
