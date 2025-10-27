import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Share,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const router = useRouter();
  const { plantData, imageUri, source } = useLocalSearchParams();
  
  const result = plantData ? JSON.parse(plantData as string) : null;
  
  if (!result) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>No plant data available</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backToHomeButton}>
          <Text style={styles.backToHomeText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const plantInfo = result.ai;
  const plantNetInfo = result.plantnet;

  const handleShare = async () => {
    try {
      const commonName = plantInfo.common_names?.[0] || plantInfo.scientific_name;
      await Share.share({
        message: `Check out this plant I identified with BloomBuddy!\n\n🌱 ${commonName}\n🔬 ${plantInfo.scientific_name}\n🌿 Family: ${plantInfo.family}\n\n${plantInfo.short_description}`,
        title: `${commonName} - Plant Identification`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  const handleSave = () => {
    Alert.alert(
      'Save Plant',
      'This plant has been saved to your collection!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.headerTextContainer}
          >
            <Text style={styles.headerTitle}>Plant Identified! 🎉</Text>
            <Text style={styles.headerSubtitle}>Here's what we found</Text>
          </MotiView>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plant Information Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 200 }}
          style={styles.plantCard}
        >
          {imageUri && (
            <Image source={{ uri: imageUri as string }} style={styles.plantImage} />
          )}
          
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>
              {plantInfo.common_names?.[0] || plantInfo.scientific_name}
            </Text>
            <Text style={styles.scientificName}>{plantInfo.scientific_name}</Text>
            <Text style={styles.family}>Family: {plantInfo.family}</Text>
            <Text style={styles.confidence}>
              Confidence: {Math.round((plantNetInfo.score || 0) * 100)}%
            </Text>
            
            <Text style={styles.description}>{plantInfo.short_description}</Text>
            
            {/* Care Instructions */}
            <View style={styles.careSection}>
              <Text style={styles.careTitle}>🌱 Care Instructions</Text>
              <View style={styles.careGrid}>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>💧 Watering</Text>
                  <Text style={styles.careValue}>{plantInfo.care?.watering}</Text>
                </View>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>☀️ Sunlight</Text>
                  <Text style={styles.careValue}>{plantInfo.care?.sunlight}</Text>
                </View>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>🌱 Soil</Text>
                  <Text style={styles.careValue}>{plantInfo.care?.soil}</Text>
                </View>
                <View style={styles.careItem}>
                  <Text style={styles.careLabel}>🌡️ Temperature</Text>
                  <Text style={styles.careValue}>{plantInfo.care?.temperature}</Text>
                </View>
              </View>
            </View>
            
            {/* Additional Info */}
            {plantInfo.pet_friendly && (
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>🐕 Pet Safety</Text>
                <Text style={styles.infoText}>{plantInfo.pet_friendly}</Text>
              </View>
            )}
            
            {plantInfo.medicinal_use && (
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>💊 Medicinal Uses</Text>
                <Text style={styles.infoText}>{plantInfo.medicinal_use}</Text>
              </View>
            )}
            
            {plantInfo.recommended_action && (
              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationTitle}>💡 Recommendation</Text>
                <Text style={styles.recommendationText}>{plantInfo.recommended_action}</Text>
              </View>
            )}
          </View>
        </MotiView>

        {/* Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
          style={styles.actionSection}
        >
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => router.push('/(tabs)/home')}
          >
            <LinearGradient
              colors={[Colors.accent, '#FF8C42']}
              style={styles.actionGradient}
            >
              <Ionicons name="camera" size={20} color={Colors.white} />
              <Text style={styles.actionText}>Identify Another Plant</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={styles.secondaryAction}
              onPress={() => router.push('/(tabs)/collection')}
            >
              <View style={styles.secondaryActionContent}>
                <Ionicons name="library" size={20} color={Colors.primary} />
                <Text style={styles.secondaryActionText}>View Collection</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryAction}>
              <View style={styles.secondaryActionContent}>
                <Ionicons name="information-circle" size={20} color={Colors.primary} />
                <Text style={styles.secondaryActionText}>Learn More</Text>
              </View>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Fun Facts Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 1000 }}
          style={styles.funFactsSection}
        >
          <Text style={styles.funFactsTitle}>🌟 Did You Know?</Text>
          <View style={styles.funFactsContainer}>
            <View style={styles.funFact}>
              <Text style={styles.funFactEmoji}>🌱</Text>
              <Text style={styles.funFactText}>
                Plants produce oxygen that we breathe every day
              </Text>
            </View>
            <View style={styles.funFact}>
              <Text style={styles.funFactEmoji}>🐝</Text>
              <Text style={styles.funFactText}>
                Many plants depend on pollinators for reproduction
              </Text>
            </View>
            <View style={styles.funFact}>
              <Text style={styles.funFactEmoji}>💚</Text>
              <Text style={styles.funFactText}>
                Indoor plants can improve air quality and mood
              </Text>
            </View>
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  primaryAction: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryActionContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  secondaryActionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  funFactsSection: {
    backgroundColor: Colors.cardSecondary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  funFactsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  funFactsContainer: {
    gap: 12,
  },
  funFact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
  },
  funFactEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  funFactText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  plantCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plantImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  plantInfo: {
    padding: 20,
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
  confidence: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  careSection: {
    marginBottom: 20,
  },
  careTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  careGrid: {
    gap: 12,
  },
  careItem: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
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
  infoSection: {
    marginBottom: 16,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 12,
    padding: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  recommendationSection: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  backToHomeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToHomeText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});