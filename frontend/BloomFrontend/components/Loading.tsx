import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

let LottieView: any = null;
if (Platform.OS !== 'web') {
  LottieView = require('lottie-react-native').default;
}

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Loading({ message, size = 'medium' }: LoadingProps) {
  const getSize = () => {
    switch (size) {
      case 'small': return 100;
      case 'large': return 300;
      default: return 200;
    }
  };

  const animationSize = getSize();

  if (!LottieView) {
    // Enhanced fallback for web
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          {/* Animated Plant Icon */}
          <MotiView
            from={{ scale: 0.8, rotate: '0deg' }}
            animate={{ scale: 1.2, rotate: '360deg' }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
              repeatReverse: true,
            }}
            style={styles.plantIcon}
          >
            <Text style={[styles.plantEmoji, { fontSize: animationSize * 0.3 }]}>🌱</Text>
          </MotiView>

          {/* Floating Elements */}
          {[...Array(6)].map((_, i) => (
            <MotiView
              key={i}
              from={{ 
                translateY: -20, 
                translateX: -10,
                opacity: 0,
                scale: 0.5 
              }}
              animate={{ 
                translateY: 20, 
                translateX: 10,
                opacity: 0.8,
                scale: 1 
              }}
              transition={{
                type: 'timing',
                duration: 2000 + i * 200,
                loop: true,
                delay: i * 300,
                repeatReverse: true,
              }}
              style={[
                styles.floatingElement,
                {
                  left: (i % 3) * 60 + 20,
                  top: Math.floor(i / 3) * 40 + 20,
                }
              ]}
            >
              <Text style={styles.floatingEmoji}>
                {['🌿', '🌸', '🍃', '🌺', '🌼', '🌻'][i]}
              </Text>
            </MotiView>
          ))}

          {/* Pulsing Circles */}
          {[...Array(3)].map((_, i) => (
            <MotiView
              key={`circle-${i}`}
              from={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: true,
                delay: i * 600,
              }}
              style={[styles.pulseCircle, { 
                width: animationSize * 0.8,
                height: animationSize * 0.8,
                borderRadius: animationSize * 0.4,
              }]}
            />
          ))}
        </View>

        {message && (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: 1000,
              delay: 500,
            }}
          >
            <Text style={styles.message}>{message}</Text>
          </MotiView>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.lottieContainer}>
        {/* Background Gradient */}
        <LinearGradient
          colors={[Colors.cardSecondary, 'transparent']}
          style={[styles.gradientBackground, {
            width: animationSize + 40,
            height: animationSize + 40,
            borderRadius: (animationSize + 40) / 2,
          }]}
        />

        {/* Lottie Animation */}
        <LottieView
          source={require('../assets/lottie/plant.json')}
          autoPlay
          loop
          style={[styles.animation, {
            width: animationSize,
            height: animationSize,
          }]}
        />

        {/* Decorative Elements */}
        {[...Array(4)].map((_, i) => (
          <MotiView
            key={i}
            from={{ 
              scale: 0,
              rotate: '0deg',
              translateX: 0,
              translateY: 0,
            }}
            animate={{ 
              scale: 1,
              rotate: '360deg',
              translateX: Math.cos(i * Math.PI / 2) * 60,
              translateY: Math.sin(i * Math.PI / 2) * 60,
            }}
            transition={{
              type: 'timing',
              duration: 3000,
              loop: true,
              delay: i * 750,
            }}
            style={styles.decorativeElement}
          >
            <Text style={styles.decorativeEmoji}>
              {['🌿', '🌸', '🍃', '🌺'][i]}
            </Text>
          </MotiView>
        ))}
      </View>

      {message && (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            damping: 15,
            delay: 800,
          }}
        >
          <Text style={styles.message}>{message}</Text>
        </MotiView>
      )}

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        {[...Array(3)].map((_, i) => (
          <MotiView
            key={i}
            from={{ scale: 0.5, opacity: 0.3 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 600,
              loop: true,
              delay: i * 200,
              repeatReverse: true,
            }}
            style={styles.progressDot}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardSecondary,
    borderRadius: 100,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  plantEmoji: {
    textAlign: 'center',
  },
  floatingElement: {
    position: 'absolute',
  },
  floatingEmoji: {
    fontSize: 16,
  },
  pulseCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  lottieContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    position: 'absolute',
  },
  animation: {
    zIndex: 1,
  },
  decorativeElement: {
    position: 'absolute',
    zIndex: 0,
  },
  decorativeEmoji: {
    fontSize: 20,
    opacity: 0.7,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});