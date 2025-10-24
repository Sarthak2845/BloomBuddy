# 🌺 BloomBuddy - Plant Identification App

A beautiful and intuitive React Native app for identifying plants using AI-powered recognition. Built with modern design principles and smooth animations.

## ✨ Features

### 🔍 Plant Identification
- **Photo Recognition**: Take photos or select from gallery to identify plants
- **Name Search**: Search plants by their common or scientific names
- **Instant Results**: Get detailed plant information within seconds

### 📱 Modern UI/UX
- **Gradient Backgrounds**: Beautiful linear gradients throughout the app
- **Smooth Animations**: Powered by Moti for fluid transitions
- **Floating Tab Bar**: Modern bottom navigation with gradient backgrounds
- **Responsive Design**: Optimized for all screen sizes

### 🌱 Plant Information
- **Comprehensive Details**: Scientific name, family, origin, and description
- **Care Instructions**: Expandable care guides for each plant
- **Difficulty Levels**: Easy, Medium, or Hard care requirements
- **Toxicity Warnings**: Safety information for pets and children

### 📚 Personal Collection
- **Save Plants**: Build your personal plant collection
- **Search & Filter**: Find plants by name or care difficulty
- **Statistics**: Track your plant identification journey
- **Visual Grid**: Beautiful card-based plant display

### 👤 User Profile
- **Personal Stats**: Track plants identified, active days, achievements
- **Settings**: Customize notifications and app preferences
- **Achievement System**: Unlock badges for plant identification milestones

## 🎨 Design System

### Color Palette
- **Primary**: Deep forest green (#2D5016)
- **Secondary**: Sage green (#8FBC8F)
- **Accent**: Warm orange (#FFB347)
- **Background**: Light mint (#F8FDF8)
- **Success**: Green (#28A745)
- **Warning**: Yellow (#FFC107)
- **Error**: Red (#DC3545)

### Typography
- **Headers**: Bold, modern fonts with proper hierarchy
- **Body Text**: Readable fonts with optimal line spacing
- **Scientific Names**: Italic styling for botanical accuracy

### Animations
- **Entry Animations**: Smooth fade-in and scale effects
- **Floating Elements**: Subtle plant-themed decorative animations
- **Loading States**: Engaging plant growth animations
- **Transitions**: Smooth page transitions and micro-interactions

## 🛠 Technical Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript development
- **Expo Router**: File-based navigation system

### UI & Animations
- **Moti**: Declarative animations for React Native
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **Expo Vector Icons**: Comprehensive icon library
- **Lottie**: Complex animations and micro-interactions

### Features & Services
- **Expo Image Picker**: Camera and gallery integration
- **Firebase**: Backend services and authentication
- **Expo Status Bar**: Status bar customization

## 📁 Project Structure

```
BloomFrontend/
├── app/                          # App screens and navigation
│   ├── (tabs)/                   # Tab-based screens
│   │   ├── home.tsx             # Plant identification screen
│   │   ├── result.tsx           # Plant details and results
│   │   ├── collection.tsx       # Personal plant collection
│   │   ├── profile.tsx          # User profile and settings
│   │   └── _layout.tsx          # Tab navigation layout
│   ├── auth/                    # Authentication screens
│   │   ├── login.tsx            # Login screen
│   │   ├── register.tsx         # Registration screen
│   │   └── _layout.tsx          # Auth layout
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Welcome/landing screen
├── components/                   # Reusable components
│   ├── PlantCard.tsx            # Enhanced plant information card
│   ├── Loading.tsx              # Loading animations
│   └── FlowerCard.tsx           # Legacy flower card (deprecated)
├── constants/                    # App constants
│   ├── Colors.ts                # Color system
│   └── theme.ts                 # Theme configuration
├── assets/                      # Static assets
│   ├── images/                  # Image assets
│   ├── lottie/                  # Lottie animation files
│   └── plant/                   # Plant-related images
└── lib/                         # Utilities and services
    ├── firebase/                # Firebase configuration
    └── services/                # API services
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BloomBuddy/frontend/BloomFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install new dependencies**
   ```bash
   npx expo install expo-linear-gradient
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 📱 Screen Overview

### 🏠 Welcome Screen
- Animated plant logo and floating elements
- Gradient background with call-to-action
- Feature highlights (Photo ID, Plant Info, Care Tips)

### 🔐 Authentication
- **Login**: Email/password with social login options
- **Register**: Full registration form with validation
- Modern gradient backgrounds with floating animations

### 🏡 Home Screen
- Search by plant name with autocomplete
- Camera integration for photo identification
- Gallery selection for existing photos
- Tips section for better identification results

### 📊 Results Screen
- Comprehensive plant information card
- Expandable care instructions
- Share and save functionality
- Fun facts about plants

### 📚 Collection Screen
- Personal plant library with search and filters
- Statistics dashboard (Easy/Medium/Hard care plants)
- Grid layout with plant cards
- Empty state for new users

### 👤 Profile Screen
- User statistics and achievements
- Settings (notifications, dark mode)
- Menu options (help, privacy, logout)
- App version and credits

## 🎯 Key Features Implementation

### Plant Identification Flow
1. User takes photo or enters plant name
2. Loading animation with plant growth theme
3. AI processing (simulated with timeout)
4. Results displayed in beautiful card format
5. Option to save to personal collection

### Animation System
- **Moti**: Declarative animations for smooth transitions
- **Staggered Animations**: Sequential element appearances
- **Floating Elements**: Subtle background decorations
- **Loading States**: Engaging plant-themed loaders

### Navigation
- **Floating Tab Bar**: Modern bottom navigation
- **Gradient Backgrounds**: Active tab highlighting
- **Smooth Transitions**: Page-to-page animations

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Add your configuration to `lib/firebase/config.ts`

## 🎨 Customization

### Colors
Modify `constants/Colors.ts` to change the app's color scheme:
```typescript
export default {
  primary: '#2D5016',      // Main brand color
  secondary: '#8FBC8F',    // Secondary brand color
  accent: '#FFB347',       // Accent color for highlights
  // ... other colors
};
```

### Animations
Adjust animation timing and effects in individual components using Moti props:
```typescript
<MotiView
  from={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', damping: 15 }}
>
```

## 📈 Performance Optimizations

- **Image Optimization**: Proper image sizing and caching
- **Animation Performance**: Hardware-accelerated animations
- **Memory Management**: Efficient component lifecycle
- **Bundle Size**: Optimized imports and tree shaking

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **iOS simulator not opening**
   ```bash
   npx expo run:ios
   ```

3. **Android build issues**
   ```bash
   npx expo run:android
   ```

### Dependencies Issues
If you encounter dependency conflicts:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **Moti**: For beautiful React Native animations
- **Unsplash**: For high-quality plant images
- **Lottie**: For engaging micro-animations
- **Plant Community**: For inspiration and feedback

## 📞 Support

For support and questions:
- Email: support@bloombuddy.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: [Wiki](https://github.com/your-repo/wiki)

---

Made with 💚 for plant lovers everywhere 🌱