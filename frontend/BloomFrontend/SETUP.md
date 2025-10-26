# BloomBuddy Frontend Setup

## Overview
This is the React Native frontend for BloomBuddy, a plant identification app that uses AI to identify plants from photos.

## Features
- 📸 Camera and gallery image selection
- 🤖 AI-powered plant identification via backend API
- 📱 Clean, modern UI with animations
- 🔥 Firebase Firestore for plant history
- 📊 Plant collection with confidence scoring
- 🎨 Beautiful gradients and smooth animations

## Backend Integration
The app connects to your backend API at:
`https://bloombackend-ol68q46j7-sarthak-ranas-projects-1e9f153c.vercel.app/api/identify`

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The `.env` file is already configured with Firebase credentials:
```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAnDXu-hGne92qP--3mMRTJ-WYQUfX-Bpk
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=bloombuddy-846d3.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=bloombuddy-846d3
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=bloombuddy-846d3.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=99569718851
EXPO_PUBLIC_FIREBASE_APP_ID=1:99569718851:web:379d16e1cf274f919126f6
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-T74V038YBR
```

### 3. Run the App
```bash
# Start the development server
npm start

# For specific platforms
npm run android
npm run ios
npm run web
```

## Key Features Implemented

### 🔄 Updated Plant Service
- Connects to your backend API endpoint
- Handles image upload with FormData
- Saves identification results to Firestore
- Manages plant history with timestamps

### 🏠 Enhanced Home Screen
- Camera and gallery integration
- Real-time image preview
- Loading states with animations
- Error handling and user feedback
- Anonymous authentication for seamless experience

### 📊 Smart Collection Screen
- Displays plant history from Firestore
- Confidence-based filtering (High/Medium/Low)
- Search functionality
- Pull-to-refresh
- Beautiful plant cards with metadata

### 📱 Improved Result Screen
- Displays comprehensive plant information
- Shows AI analysis and care instructions
- Confidence scoring
- Share functionality
- Navigation to collection

### 🔐 Authentication
- Anonymous authentication for immediate use
- Firebase Auth integration
- Seamless user experience

## API Integration Details

### Identify Endpoint
```typescript
POST /api/identify
Content-Type: multipart/form-data

Body:
- images: File[] (plant photos)
- organs: string[] (plant parts: leaf, flower, etc.)

Response:
{
  plantnet: {
    scientific_name: string,
    common_names: string[],
    family: string,
    score: number
  },
  ai: {
    scientific_name: string,
    common_names: string[],
    family: string,
    category: string,
    short_description: string,
    care: {
      watering: string,
      sunlight: string,
      soil: string,
      temperature: string,
      fertilizer: string,
      pruning: string
    },
    pests_and_diseases: string,
    medicinal_use: string,
    pet_friendly: string,
    recommended_action: string
  }
}
```

## Firestore Structure
```
users/{userId}/plant_history/{docId}
{
  scientific_name: string,
  common_names: string[],
  family: string,
  category: string,
  description: string,
  care: object,
  confidence_score: number,
  image_uri: string,
  created_at: timestamp,
  user_id: string
}
```

## UI Improvements Made

### 🎨 Design Enhancements
- Fixed color constants (white color was incorrect)
- Added loading overlays for better UX
- Improved button states and interactions
- Enhanced error handling with user-friendly messages

### 📱 Mobile Optimizations
- Proper permission handling for camera/gallery
- Responsive layouts for different screen sizes
- Smooth animations with Moti
- Pull-to-refresh functionality

### 🔧 Bug Fixes
- Fixed authentication flow
- Improved error handling
- Better loading states
- Proper navigation between screens

## Testing the App

1. **Start the app**: `npm start`
2. **Take a photo**: Use camera or select from gallery
3. **Wait for identification**: The app will call your backend API
4. **View results**: See detailed plant information
5. **Check collection**: View your plant history

## Troubleshooting

### Common Issues
1. **API Connection**: Ensure your backend is running and accessible
2. **Permissions**: Grant camera and photo library permissions
3. **Firebase**: Check Firebase configuration in console
4. **Network**: Ensure device has internet connection

### Debug Mode
Enable debug logging by checking the console for detailed error messages.

## Next Steps
- Add user authentication (email/password)
- Implement plant care reminders
- Add social sharing features
- Create plant care guides
- Add offline mode support