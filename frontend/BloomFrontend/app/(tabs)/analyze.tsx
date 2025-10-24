import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import * as ImagePicker from 'expo-image-picker';
import { processPlantPhoto, addToMyPlants } from '../../lib/services/plantService';

export default function AnalyzeScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [plantData, setPlantData] = useState<any>(null);
  const [addingToPlants, setAddingToPlants] = useState(false);
  const [addedToPlants, setAddedToPlants] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setPlantData(null);
      setAddedToPlants(false);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const imageFile = {
        uri: selectedImage,
        name: 'plant.jpg',
        type: 'image/jpeg'
      };

      const result = await processPlantPhoto(imageFile);
      setPlantData(result);
    } catch (error: any) {
      Alert.alert('Analysis Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMyPlants = async () => {
    if (!plantData?.id) return;

    setAddingToPlants(true);
    try {
      await addToMyPlants(plantData.id);
      setAddedToPlants(true);
      Alert.alert('Success!', 'Plant added to your collection');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setAddingToPlants(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Plant Analyzer</ThemedText>
        <ThemedText style={styles.subtitle}>
          Take or select a photo to identify your plant
        </ThemedText>
      </ThemedView>

      {/* Image Selection */}
      <ThemedView style={styles.imageSection}>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <Pressable style={styles.changeImageButton} onPress={pickImage}>
              <ThemedText style={styles.changeImageText}>Change Photo</ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.selectImageButton} onPress={pickImage}>
            <ThemedText style={styles.selectImageIcon}>📸</ThemedText>
            <ThemedText style={styles.selectImageText}>Select Plant Photo</ThemedText>
          </Pressable>
        )}
      </ThemedView>

      {/* Analyze Button */}
      {selectedImage && !plantData && (
        <ThemedView style={styles.analyzeSection}>
          <Pressable 
            style={[styles.analyzeButton, loading && styles.buttonDisabled]} 
            onPress={analyzePhoto}
            disabled={loading}
          >
            <ThemedText style={styles.analyzeButtonText}>
              {loading ? 'Analyzing...' : '🔍 Analyze Plant'}
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}

      {/* Results */}
      {plantData && (
        <ThemedView style={styles.resultsSection}>
          <View style={styles.resultCard}>
            <View style={styles.plantHeader}>
              <ThemedText style={styles.species}>{plantData.species}</ThemedText>
              <ThemedText style={styles.commonName}>{plantData.commonName}</ThemedText>
              <View style={styles.healthBadge}>
                <ThemedText style={styles.healthText}>{plantData.healthStatus}</ThemedText>
              </View>
            </View>

            <View style={styles.careSection}>
              <ThemedText style={styles.sectionTitle}>Care Instructions</ThemedText>
              <View style={styles.careItem}>
                <ThemedText style={styles.careIcon}>💧</ThemedText>
                <ThemedText style={styles.careText}>{plantData.careTips?.waterFrequency}</ThemedText>
              </View>
              <View style={styles.careItem}>
                <ThemedText style={styles.careIcon}>☀️</ThemedText>
                <ThemedText style={styles.careText}>{plantData.careTips?.sunlight}</ThemedText>
              </View>
              <View style={styles.careItem}>
                <ThemedText style={styles.careIcon}>🌱</ThemedText>
                <ThemedText style={styles.careText}>{plantData.careTips?.soil}</ThemedText>
              </View>
            </View>

            <View style={styles.actionSection}>
              <ThemedText style={styles.actionTitle}>Recommended Action</ThemedText>
              <ThemedText style={styles.actionText}>{plantData.recommendedAction}</ThemedText>
            </View>

            <Pressable 
              style={[styles.addButton, (addingToPlants || addedToPlants) && styles.buttonDisabled]} 
              onPress={handleAddToMyPlants}
              disabled={addingToPlants || addedToPlants}
            >
              <ThemedText style={styles.addButtonText}>
                {addedToPlants ? '✅ Added to My Plants' : addingToPlants ? 'Adding...' : '🌿 Add to My Plants'}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  imageSection: {
    padding: 24,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  changeImageButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changeImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  selectImageButton: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  selectImageIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  selectImageText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
  },
  analyzeSection: {
    padding: 24,
    backgroundColor: 'transparent',
  },
  analyzeButton: {
    backgroundColor: '#059669',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resultsSection: {
    padding: 24,
    backgroundColor: 'transparent',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  plantHeader: {
    marginBottom: 20,
  },
  species: {
    fontSize: 22,
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: 4,
  },
  commonName: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  healthBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  healthText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  careSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#064e3b',
    marginBottom: 12,
  },
  careItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  careIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  careText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#064e3b',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});