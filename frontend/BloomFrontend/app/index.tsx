import { View, Text, TouchableOpacity, StyleSheet, Platform,Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

let LottieView: any = null;
if (Platform.OS !== 'web') {
  LottieView = require('lottie-react-native').default;
}

export default function IndexScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BloomBuddy</Text>
      <Text style={styles.subtitle}>Your Smart Companion for Happy Plants</Text>
      <Image
        source={require('../assets/images/plant.png')}
        style={{ width: 150, height: 250, marginBottom: 20 }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  title: { fontSize: 68, fontWeight: '900', color:Colors.text },
  subtitle: { fontSize: 26, color: 'gray', marginBottom: 20 },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 12 },
  buttonText: { color: '#000', fontWeight: '600',fontSize: 18},
});
