import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import FlowerCard from '../../components/FlowerCard';

export default function ResultScreen() {
  const router = useRouter();
  const { name, scientific, family, region, description, img } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.title}>🌸 Flower Identified!</Text>

      <FlowerCard
        name={name as string}
        scientific={scientific as string}
        family={family as string}
        region={region as string}
        description={description as string}
        image={img as string}
      />

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
