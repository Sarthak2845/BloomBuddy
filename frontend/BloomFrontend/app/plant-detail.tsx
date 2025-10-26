import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  Share,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { 
  getPlantById, 
  updatePlantRecord, 
  deletePlantRecord, 
  toggleFavorite, 
  addPlantNote, 
  addPlantTags,
  PlantRecord 
} from '@/lib/services/plantService';
import Loading from '@/components/Loading';

const { width } = Dimensions.get('window');

export default function PlantDetailScreen() {
  const { plantId } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState<PlantRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [tagText, setTagText] = useState('');

  useEffect(() => {
    loadPlant();
  }, [plantId]);

  const loadPlant = async () => {
    try {
      if (!plantId) return;
      const plantData = await getPlantById(plantId as string);
      if (plantData) {
        setPlant(plantData);
        setNoteText(plantData.user_notes || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load plant details');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!plant) return;
    try {
      await toggleFavorite(plant.id!, !plant.is_favorite);
      setPlant({ ...plant, is_favorite: !plant.is_favorite });
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleSaveNote = async () => {
    if (!plant) return;
    try {
      await addPlantNote(plant.id!, noteText);
      setPlant({ ...plant, user_notes: noteText });
      setShowNoteModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleAddTag = async () => {
    if (!plant || !tagText.trim()) return;
    try {
      const newTags = [...plant.tags, tagText.trim()];
      await addPlantTags(plant.id!, newTags);
      setPlant({ ...plant, tags: newTags });
      setTagText('');
      setShowTagModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add tag');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Plant',
      'Are you sure you want to delete this plant record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (plant?.id) {
                await deletePlantRecord(plant.id);
                router.back();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plant');
            }
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    if (!plant) return;
    try {
      const commonName = plant.common_names[0] || plant.scientific_name;
      await Share.share({
        message: `Check out this ${commonName} I identified with BloomBuddy!\n\n🌱 ${commonName}\n🔬 ${plant.scientific_name}\n🌿 Family: ${plant.family}\n\n${plant.description}`,
        title: `${commonName} - Plant Identification`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Loading message="Loading plant details..." />
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Plant not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFavorite} style={styles.headerButton}>
              <Ionicons 
                name={plant.is_favorite ? "heart" : "heart-outline"} 
                size={24} 
                color={plant.is_favorite ? Colors.error : Colors.white} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Plant Image */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.imageContainer}
        >
          <Image source={{ uri: plant.media.primary_image }} style={styles.plantImage} />
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {Math.round(plant.identification_data.confidence_score * 100)}% confident
            </Text>
          </View>
        </MotiView>

        {/* Basic Info */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
          style={styles.infoCard}
        >
          <Text style={styles.plantName}>
            {plant.common_names[0] || plant.scientific_name}
          </Text>
          <Text style={styles.scientificName}>{plant.scientific_name}</Text>
          <Text style={styles.family}>Family: {plant.family}</Text>
          <Text style={styles.category}>Category: {plant.category}</Text>
          
          {plant.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {plant.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                <TouchableOpacity onPress={() => setShowTagModal(true)} style={styles.addTagButton}>
                  <Ionicons name="add" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <Text style={styles.description}>{plant.description}</Text>
        </MotiView>

        {/* Care Instructions */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          style={styles.careCard}
        >
          <Text style={styles.cardTitle}>🌱 Care Instructions</Text>
          
          <View style={styles.careGrid}>
            <CareItem icon="💧" label="Watering" value={plant.care_instructions.watering} />
            <CareItem icon="☀️" label="Sunlight" value={plant.care_instructions.sunlight} />
            <CareItem icon="🌱" label="Soil" value={plant.care_instructions.soil} />
            <CareItem icon="🌡️" label="Temperature" value={plant.care_instructions.temperature} />
            <CareItem icon="🧪" label="Fertilizer" value={plant.care_instructions.fertilizer} />
            <CareItem icon="✂️" label="Pruning" value={plant.care_instructions.pruning} />
          </View>
        </MotiView>

        {/* Health Info */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 600 }}
          style={styles.healthCard}
        >
          <Text style={styles.cardTitle}>🏥 Health Information</Text>
          
          <InfoSection title="Pests & Diseases" content={plant.health_info.pests_and_diseases} />
          <InfoSection title="Common Issues" content={plant.health_info.typical_issues} />
          <InfoSection title="Recommended Action" content={plant.health_info.recommended_action} />
        </MotiView>

        {/* Additional Info */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
          style={styles.additionalCard}
        >
          <Text style={styles.cardTitle}>ℹ️ Additional Information</Text>
          
          <InfoSection title="Pet Safety" content={plant.additional_info.pet_friendly} />
          <InfoSection title="Medicinal Uses" content={plant.additional_info.medicinal_use} />
        </MotiView>

        {/* Notes Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 1000 }}
          style={styles.notesCard}
        >
          <View style={styles.notesHeader}>
            <Text style={styles.cardTitle}>📝 My Notes</Text>
            <TouchableOpacity onPress={() => setShowNoteModal(true)} style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.notesText}>
            {plant.user_notes || 'No notes added yet. Tap the edit icon to add your observations!'}
          </Text>
        </MotiView>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Note Modal */}
      <Modal visible={showNoteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Notes</Text>
            <TextInput
              style={styles.noteInput}
              multiline
              placeholder="Add your observations about this plant..."
              value={noteText}
              onChangeText={setNoteText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowNoteModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNote} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tag Modal */}
      <Modal visible={showTagModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Tag</Text>
            <TextInput
              style={styles.tagInput}
              placeholder="Enter tag name..."
              value={tagText}
              onChangeText={setTagText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowTagModal(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddTag} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const CareItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.careItem}>
    <Text style={styles.careIcon}>{icon}</Text>
    <Text style={styles.careLabel}>{label}</Text>
    <Text style={styles.careValue}>{value}</Text>
  </View>
);

const InfoSection = ({ title, content }: { title: string; content: string }) => (
  <View style={styles.infoSection}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoContent}>{content || 'No information available'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  plantImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  confidenceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  plantName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  family: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  tagsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  addTagButton: {
    backgroundColor: Colors.lightGray,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  careCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  careGrid: {
    gap: 12,
  },
  careItem: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
  },
  careIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  careLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  careValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  healthCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  additionalCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  infoContent: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  notesCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    padding: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});