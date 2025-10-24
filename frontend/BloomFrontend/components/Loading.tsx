import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';

let LottieView: any = null;
if (Platform.OS !== 'web') {
  // Only import Lottie on native platforms
  LottieView = require('lottie-react-native').default;
}

export default function Loading() {
  if (!LottieView) {
    // Fallback for web or when Lottie isn't available
    return (
      <View style={styles.container}>
        {/* You can add a fallback loading spinner or image here */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/plant.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
});
