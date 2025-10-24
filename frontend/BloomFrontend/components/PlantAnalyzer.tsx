import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import * as ImagePicker from 'expo-image-picker';
import { processPlantPhoto } from '../lib/services/plantService';

export default function PlantAnalyzer() {
  const [loading, setLoading] = useState(false);

  const analyzePhoto = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageFile = {
          uri: result.assets[0].uri,
          name: 'plant.jpg',
          type: 'image/jpeg'
        };
        
        const analysis = await processPlantPhoto(imageFile);
        Alert.alert('Success!', `Plant identified: ${analysis.species}`);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={analyzePhoto}
        disabled={loading}
      >
        <ThemedText style={styles.buttonText}>
          {loading ? 'Analyzing...' : '📸 Analyze Plant'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});