# BloomBuddy Frontend

A React Native app built with Expo Router for plant identification and care management.

## Features

- 🌱 AI-powered plant identification
- 📱 Cross-platform (iOS, Android, Web)
- 🔥 Firebase authentication and database
- 🎨 Beautiful animations with Moti
- 📊 Plant collection tracking
- ⏰ Care reminders

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project setup

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd BloomBuddy/frontend/BloomFrontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with your Firebase config:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Running the App

### Development Server
```bash
expo start
```

### Clear Cache and Start
```bash
expo start -c
```

### Platform-specific Commands
```bash
# iOS Simulator
expo run:ios

# Android Emulator
expo run:android

# Web Browser
expo start --web
```

## Project Structure

```
app/
├── (tabs)/          # Tab navigation screens
├── auth/            # Authentication screens
├── _layout.tsx      # Root layout
└── index.tsx        # Welcome screen

components/          # Reusable components
constants/           # App constants and colors
contexts/           # React contexts
lib/
├── firebase/       # Firebase configuration
└── services/       # API services
```

## How It Works

1. **Welcome Screen**: Initial landing page with app introduction
2. **Authentication**: Firebase-based login/register system
3. **Home Tab**: Main dashboard with plant identification
4. **Collection Tab**: View identified plants
5. **Profile Tab**: User settings and statistics
6. **Plant Details**: Detailed information about identified plants
7. **Reminders**: Care scheduling and notifications

## Development

- Uses Expo Router for file-based routing
- Firebase for authentication and data storage
- Moti for smooth animations
- TypeScript for type safety
- React Native for cross-platform development

## Troubleshooting

- If you see "Welcome to Expo" message, ensure your `app/index.tsx` file exists
- Clear cache with `expo start -c` if experiencing issues
- Check Firebase configuration in `.env` file
- Ensure all dependencies are installed with `npm install`