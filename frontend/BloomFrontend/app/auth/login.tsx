import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { MotiView} from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/home');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight, Colors.secondary]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 200 }}
            style={styles.header}
          >
            <View
            style={styles.logoContainer}
            >
              <Image
              source={require('../../assets/images/plant.png')}
              style={styles.logoImg}
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </MotiView>

          {/* Form */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 400 }}
            style={styles.formContainer}
          >
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={Colors.textLight} 
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? [Colors.gray, Colors.gray] : ['#c1277fff', '#2f61abff']}
                style={styles.loginGradient}
              >
                {loading ? (
                  <MotiView
                    from={{ rotate: '0deg' }}
                    animate={{ rotate: '360deg' }}
                    transition={{ type: 'timing', duration: 1000, loop: true }}
                  >
                    <Ionicons name="refresh" size={20} color={Colors.white} />
                  </MotiView>
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}

          </MotiView>

          {/* Footer */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 800 }}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Don&lsquo;t have an account? </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </MotiView>

          {/* Floating Elements */}
          {[...Array(4)].map((_, i) => (
            <MotiView
              key={i}
              from={{ translateY: -20, opacity: 0 }}
              animate={{ translateY: 20, opacity: 0.3 }}
              transition={{
                type: 'timing',
                duration: 3000 + i * 500,
                loop: true,
                delay: i * 800,
                repeatReverse: true,
              }}
              style={[styles.floatingElement, { 
                left: 30 + i * 80, 
                top: 100 + i * 150 
              }]}
            >
              <Text style={styles.floatingEmoji}>
                {['🌿', '🌸', '🍃', '🌺'][i]}
              </Text>
            </MotiView>
          ))}
        </KeyboardAvoidingView>
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
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(37, 36, 36, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  linkText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  floatingElement: {
    position: 'absolute',
  },
  floatingEmoji: {
    fontSize: 20,
    opacity: 0.6,
  },
    logoContainer: {
    marginBottom: 10,
    width: 130,  // reduced from 250
    height: 130, // reduced from 250
    borderRadius: 60,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  }
});