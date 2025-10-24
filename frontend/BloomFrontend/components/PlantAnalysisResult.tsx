import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { addToMyPlants } from '../lib/services/plantService';

interface PlantAnalysisResultProps {
  plantData: {
    id: string;
    species: string;
    commonName: string;
    healthStatus: string;
    careTips: {
      waterFrequency: string;
      sunlight: string;
      soil: string;
    };
    recommendedAction: string;
  };
}

export default function PlantAnalysisResult({ plantData }: PlantAnalysisResultProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToMyPlants = async () => {
    setLoading(true);
    try {
      await addToMyPlants(plantData.id);
      setAdded(true);
      Alert.alert('Success!', 'Plant added to your collection');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.species}>{plantData.species}</ThemedText>
        <ThemedText style={styles.commonName}>{plantData.commonName}</ThemedText>
        <ThemedText style={styles.health}>Health: {plantData.healthStatus}</ThemedText>
      </View>

      <View style={styles.careSection}>
        <ThemedText style={styles.sectionTitle}>Care Tips</ThemedText>
        <ThemedText style={styles.careText}>💧 {plantData.careTips.waterFrequency}</ThemedText>
        <ThemedText style={styles.careText}>☀️ {plantData.careTips.sunlight}</ThemedText>
        <ThemedText style={styles.careText}>🌱 {plantData.careTips.soil}</ThemedText>
      </View>

      <View style={styles.actionSection}>
        <ThemedText style={styles.actionTitle}>Recommended Action</ThemedText>
        <ThemedText style={styles.actionText}>{plantData.recommendedAction}</ThemedText>
      </View>

      <Pressable 
        style={[styles.addButton, (loading || added) && styles.buttonDisabled]} 
        onPress={handleAddToMyPlants}
        disabled={loading || added}
      >
        <ThemedText style={styles.addButtonText}>
          {added ? '✅ Added to My Plants' : loading ? 'Adding...' : '🌿 Add to My Plants'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 16,
  },
  species: {
    fontSize: 20,
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: 4,
  },
  commonName: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  health: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  careSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#064e3b',
    marginBottom: 8,
  },
  careText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  actionSection: {
    marginBottom: 20,
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
  },
  addButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});