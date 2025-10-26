import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <LinearGradient colors={[Colors.primaryLight, Colors.primary]} style={styles.gradient}>
        <View style={styles.content}>
          {/* Logo */}
          <MotiView
            from={{ scale: 0, rotate: '-180deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 300 }}
            style={styles.logoContainer}
          >
            <Image source={require('../assets/images/plant.png')} style={styles.logoImg} />
          </MotiView>

          {/* Title */}
          <MotiText
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 600 }}
            style={styles.title}
          >
            BloomBuddy
          </MotiText>

          {/* Subtitle */}
          <MotiText
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 900 }}
            style={styles.subtitle}
          >
            Discover the beauty of nature
          </MotiText>

          {/* Description */}
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 1100 }}
            style={styles.description}
          >
            Identify plants instantly with AI-powered recognition
          </MotiText>

          {/* Button */}
<MotiView
  from={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', damping: 15, delay: 1400 }}
>
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.button}
    onPress={() => router.push('/auth/login')}
  >
    <LinearGradient
      colors={['#c1277fff', '#2f61abff']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.buttonGradient}
    >
      <MotiText
        from={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={styles.buttonText}
      >
        Get Started
      </MotiText>
    </LinearGradient>
  </TouchableOpacity>
</MotiView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 30 },

  logoContainer: {
    marginBottom: 20,
    width: 200,
    height: 200,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  logoImg: { width: '100%', height: '100%', resizeMode: 'contain' },

  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },

  button: {
    marginBottom: 40,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
});
