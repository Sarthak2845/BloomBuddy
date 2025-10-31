# 🪴 BloomBuddy: Your AI-Powered Plant Alchemist

![Platform](https://img.shields.io/badge/Platform-React%20Native%20%7C%20Expo-61DAFB?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Firebase%20%26%20PlantNet-FFCA28?logo=firebase&logoColor=white)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/Status-Under%20Development-orange)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/Sarthak2845/BloomBuddy?style=flat&color=blue)
![GitHub stars](https://img.shields.io/github/stars/Sarthak2845/BloomBuddy?style=flat&color=magenta)

## 🌎 Grow Smart. Grow Green. Live Sustainably.

A modern, cross-platform mobile application built with **React Native** (using **Expo Router**), grounded in **Firebase**, and supercharged by the **PlantNet API** for world-class botanical identification.

---

## ⚡️ The Vision & Mission

In a world craving more green, **BloomBuddy** is the essential digital companion for every plant parent. We bridge the gap between amateur enthusiasm and expert horticulture by providing instant, **AI-driven plant identification**, hyper-localized care recommendations, and tools to foster sustainable urban gardening.

BloomBuddy is designed to make plant care **effortless, educational, and deeply rewarding.**

---

## 📺 Product Demo (Must See!)

See how BloomBuddy works in real-time, from snapping a photo to setting your first watering reminder.

[![Watch the Demo Video](https://placehold.co/1280x720/10B981/ffffff?text=Click+to+Watch+BloomBuddy+Demo)](https://www.youtube.com/watch?v=fLMhbLuxrhQ)



---

## ✨ Key Features (Cultivating Intelligence)

Our application is packed with features designed for seamless plant care:

| Category | Feature | Description |
| :--- | :--- | :--- |
| **🔍 AI Identification** | 🌱 **Instant Plant ID** | Use your phone's camera for **AI-powered plant identification** via the PlantNet API. Get results in seconds. |
| **🪴 Personalized Care** | 📍 **Location-Based Recs** | Smart recommendations for local flora and care schedules based on your precise **location and climate**. |
| **⚙️ Digital Companion** | ⏰ **Care Reminders** | Schedule watering, fertilizing, and pruning reminders with push notifications (via Firebase). |
| **📂 Data & Tracking** | 📊 **My Digital Garden** | Store your identification history, track plant health, and manage your entire digital collection using **Firestore**. |
| **🎨 UX & Polish** | 🚀 **Fluid Design** | Smooth, delightful user experience and cross-platform compatibility (iOS, Android, Web) powered by **Moti** animations. |

---

## 🧠 Core Tech Stack

A powerful and reliable stack engineered for scale and speed:

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | **React Native** & **Expo** | Universal application development and environment management. |
| **Routing** | **Expo Router** | File-system-based navigation and deep linking. |
| **Database** | **Firebase Firestore** | Real-time, NoSQL database for user data and plant collection history. |
| **Authentication** | **Firebase Auth** | Secure, flexible user authentication. |
| **AI/Vision** | **PlantNet API** | State-of-the-art botanical recognition and metadata. |
| **Animation** | **Moti (Reanimated)** | Declarative and performant native animations. |
| **Location** | **Google Maps API** | Geo-tagging and climate analysis for recommendations. |

---

## 🚧 Challenges & Wins

| Category | Challenge | Solution / Win |
| :--- | :--- | :--- |
| **Performance** | Handling latency during image analysis (PlantNet API) | Implemented **optimistic UI updates** and robust loading states to mask API wait times. |
| **Security** | Secure environment variable and API key management | Utilized **Expo's modern secret/runtime variable system** for secure configuration across platforms. |
| **Data Flow** | Ensuring real-time synchronization across devices | Mastered **Firebase `onSnapshot` listeners** within custom React Hooks for real-time collection tracking. |

---

## 🌱 Future Growth (What's Next)

* 🧬 **Disease Detection:** Integrate **TensorFlow Lite** models for instant diagnosis of plant diseases.
* 🌤️ **Advanced Insights:** Incorporate weather data to provide proactive, context-aware plant health reports and watering adjustments.
* 🏘️ **Community Gardens:** Implement a social layer for users to share successful care tips, ask questions, and discover local plant swaps.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16+)
* npm or yarn
* Expo CLI (`npm install -g @expo/cli`)
* Access keys for PlantNet API and a configured Firebase Project.

### 1. Clone the Repository

```bash
git clone [https://github.com/Sarthak2845/BloomBuddy.git](https://github.com/Sarthak2845/BloomBuddy.git)
cd BloomBuddy/frontend/BloomFrontend
````

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Configure Environment

Create a **`.env`** file in the root directory and populate it with your environment variables:

```
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Third-Party APIs
PLANTNET_API_KEY=your_plantnet_key
```

### 4\. Run Locally

```bash
# Start the development server
expo start

# For a specific platform (e.g., iOS Simulator)
expo run:ios
```

-----

## 👨‍🔬 The Cultivators

| Role | Name | Focus Area |
| :--- | :--- | :--- |
| **Architect** | **[Sarthak](https://github.com/Sarthak2845)** | Backend Infrastructure, API Handling, and Database Modeling |
| **Innovator** | **[Avinash](https://github.com/avinashshetty123)** | Front-End Development, UI/UX Design, and Feature Integration |
