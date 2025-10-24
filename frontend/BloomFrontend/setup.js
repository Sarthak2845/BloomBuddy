#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌱 Setting up BloomBuddy...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root.');
  process.exit(1);
}

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Install additional Expo dependencies
  console.log('🔧 Installing Expo dependencies...');
  execSync('npx expo install expo-linear-gradient', { stdio: 'inherit' });
  
  // Create .env file if it doesn't exist
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    const envContent = `# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# API Configuration
PLANT_API_URL=https://api.plantnet.org
PLANT_API_KEY=your_plant_api_key_here
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created. Please update with your actual values.');
  }
  
  // Check if assets directory exists
  const assetsDir = 'assets';
  if (!fs.existsSync(assetsDir)) {
    console.log('📁 Creating assets directory...');
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.mkdirSync(path.join(assetsDir, 'images'), { recursive: true });
    fs.mkdirSync(path.join(assetsDir, 'lottie'), { recursive: true });
    fs.mkdirSync(path.join(assetsDir, 'plant'), { recursive: true });
  }
  
  console.log('\n🎉 Setup complete! Here\'s what to do next:\n');
  console.log('1. Update your .env file with actual Firebase credentials');
  console.log('2. Add plant images to the assets/plant/ directory');
  console.log('3. Run "npm start" to start the development server');
  console.log('4. Press "i" for iOS simulator or "a" for Android emulator\n');
  
  console.log('📚 Useful commands:');
  console.log('  npm start          - Start the development server');
  console.log('  npm run android    - Run on Android');
  console.log('  npm run ios        - Run on iOS');
  console.log('  npm run web        - Run on web');
  console.log('  npx expo --help    - Get help with Expo CLI\n');
  
  console.log('🌟 Happy coding with BloomBuddy! 🌱');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n🔧 Try running these commands manually:');
  console.log('  npm install');
  console.log('  npx expo install expo-linear-gradient');
  process.exit(1);
}