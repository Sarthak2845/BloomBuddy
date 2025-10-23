# 🌱 BloomBuddy

Your personal plant care companion with AI-powered plant identification and care recommendations.

## ✨ Features

- **Smart Plant Identification** - AI-powered plant recognition using Pl@ntNet API
- **Personalized Care Tips** - Get tailored watering, lighting, and care advice
- **Growth Tracking** - Monitor your plants with photo journals
- **Plant Health Analysis** - Instant diagnosis and treatment recommendations
- **Community Features** - Connect with fellow plant parents
- **Authentication** - Secure login with email/password and Google Sign-In

## 🚀 Quick Start

### Prerequisites

- Node.js (v20+)
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BloomBuddy/frontend/BloomFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Firebase configuration to `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Firebase Setup

### Authentication
1. Enable Email/Password and Google providers in Firebase Console
2. Add your domain to authorized domains

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Plant Analysis Integration

### Required Packages
```bash
npm install axios @google/genai
expo install expo-image-picker expo-file-system
```

### Usage Example
```javascript
import { processPlantPhoto } from '../lib/services/plantService';
import * as ImagePicker from 'expo-image-picker';

const analyzePhoto = async () => {
  const result = await ImagePicker.launchImageLibraryAsync();
  if (!result.canceled) {
    const imageFile = {
      uri: result.assets[0].uri,
      name: 'plant.jpg',
      type: 'image/jpeg'
    };
    
    const metadata = {
      imageUrl: 'https://your-storage-url.com/image.jpg',
      uploadedAt: new Date().toISOString(),
      geolocation: { lat: 34.0, lng: -118.0 }
    };
    
    const analysis = await processPlantPhoto(imageFile, metadata);
    console.log('Plant analysis:', analysis);
  }
};
```

## 🏗️ Project Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   └── auth/              # Authentication screens
├── components/            # Reusable components
│   ├── auth/              # Auth-specific components
│   └── ui/                # UI components
├── lib/                   # Core services
│   ├── firebase/          # Firebase configuration
│   └── services/          # API services
└── constants/             # App constants
```

## 🔐 Security

- API keys are stored in environment variables
- Firebase security rules protect user data
- Authentication required for all plant operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@bloombuddy.com or join our Discord community.

---

Made with 💚 for plant lovers everywhere