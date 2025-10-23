import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

export default function ResultScreen() {
  const router = useRouter();
  const { name, scientific, family, region, description, img } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.title}>🌷 Flower Identified!</Text>

      {img && <Image source={{ uri: img as string }} style={styles.image} />}

      <View style={styles.card}>
        <Text style={styles.flowerName}>{name}</Text>
        <Text style={styles.scientific}>{scientific}</Text>

        <View style={styles.line} />

        <Text style={styles.detail}>🌿 Family: {family}</Text>
        <Text style={styles.detail}>🌍 Region: {region}</Text>

        <Text style={styles.desc}>{description}</Text>
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>🔙 Identify Another Flower</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  flowerName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  scientific: {
    fontStyle: 'italic',
    color: '#6B4F4F',
    textAlign: 'center',
    marginBottom: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#FFD6E0',
    marginVertical: 10,
  },
  detail: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 6,
  },
  desc: {
    marginTop: 10,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  backButton: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  backText: {
    color: '#fff',
    fontWeight: '700',
  },
});
