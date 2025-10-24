import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [flowerName, setFlowerName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const mockFlowerData = {
    name: 'Lilium auratum',
    scientific: 'Lilium auratum Lindl.',
    family: 'Liliaceae',
    region: 'Japan, found in temperate climates',
    description:
      'Known as the Golden-rayed Lily, this flower has large white petals with golden streaks and a sweet fragrance that attracts butterflies.',
  };

  const identifyFlower = async (source: 'name' | 'image') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(tabs)/result',
        params: {
          ...mockFlowerData,
          from: source,
          img: image,
        },
      });
    }, 2500);
  };

  const handleImagePick = async (fromGallery = false) => {
    const picker = fromGallery
      ? ImagePicker.launchImageLibraryAsync
      : ImagePicker.launchCameraAsync;

    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      identifyFlower('image');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.title}>🌸 BloomBuddy</Text>
      <Text style={styles.subtitle}>Discover the secret life of flowers</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter flower name..."
          placeholderTextColor="#B9808A"
          style={styles.input}
          value={flowerName}
          onChangeText={setFlowerName}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => identifyFlower('name')}
          disabled={!flowerName || loading}
        >
          <Text style={styles.buttonText}>Identify</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cameraButton} onPress={() => router.push('/(tabs)/analyze')}>
          <Text style={styles.cameraText}>🌿 Analyze Plant</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraButton} onPress={() => handleImagePick(false)}>
          <Text style={styles.cameraText}>📸 Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryButton} onPress={() => handleImagePick(true)}>
          <Text style={styles.cameraText}>🖼️ Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>🌼 Analyzing your flower...</Text>
        </View>
      )}
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
    fontSize: 34,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.text,
    fontSize: 16,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderColor: Colors.accent,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#FFF',
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  actions: {
    marginTop: 10,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
    width: '80%',
  },
  galleryButton: {
    backgroundColor: '#FFE5EC',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
    width: '80%',
  },
  cameraText: {
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginTop: 20,
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text,
    fontWeight: '500',
  },
});
