import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <LinearGradient
        colors={[Colors.primaryLight,Colors.primary]}
        style={styles.gradient}
      >
        {/* Floating Elements */}
        <MotiView
          from={{ translateY: -20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 0.3 }}
          transition={{ type: 'timing', duration: 2000, loop: true, repeatReverse: true }}
          style={[styles.floatingElement, { top: 100, left: 50 }]}
        >
          <Text style={styles.emoji}>🌿</Text>
        </MotiView>
        
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 0.3 }}
          transition={{ type: 'timing', duration: 2500, loop: true, repeatReverse: true, delay: 500 }}
          style={[styles.floatingElement, { top: 200, right: 40 }]}
        >
          <Text style={styles.emoji}>🌸</Text>
        </MotiView>
        
        <MotiView
          from={{ translateY: -15, opacity: 0 }}
          animate={{ translateY: 0, opacity: 0.3 }}
          transition={{ type: 'timing', duration: 3000, loop: true, repeatReverse: true, delay: 1000 }}
          style={[styles.floatingElement, { bottom: 200, left: 30 }]}
        >
          <Text style={styles.emoji}>🍃</Text>
        </MotiView>

        <View style={styles.content}>
          {/* Logo Animation */}
          <MotiView
            from={{ scale: 0, rotate: '-180deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 300 }}
            style={styles.logoContainer}
          >
            <Image
              source={require('../assets/images/plant.png')}
              style={styles.logoImg}
            />
          </MotiView>

          {/* Title Animation */}
          <MotiText
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 600 }}
            style={styles.title}
          >
            BloomBuddy
          </MotiText>

          {/* Subtitle Animation */}
          <MotiText
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 900 }}
            style={styles.subtitle}
          >
            Discover the beauty of nature
          </MotiText>
          
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 1100 }}
            style={styles.description}
          >
            Identify plants instantly with AI-powered recognition
          </MotiText>

          {/* Button Animation */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 1400 }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.accent,'#67AE6E']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  floatingElement: {
    position: 'absolute',
  },
  emoji: {
    fontSize: 30,
  },
  logoContainer: {
    marginBottom: 20,
    width: 220,  // reduced from 250
    height: 220, // reduced from 250
    borderRadius: 60,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    lineHeight: 22,
  },
  button: {
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonEmoji: {
    fontSize: 18,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  feature: {
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
});