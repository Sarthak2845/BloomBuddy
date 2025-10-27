import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Colors from '../constants/Colors';
import Loading from '@/components/Loading';
import { getLocationRecommendations } from '@/lib/services/plantService';

const { width } = Dimensions.get('window');

interface PlantRecommendation {
  name: string;
  scientific_name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  best_season: string;
  growth_time: string;
  benefits: string;
  care_tips: string;
  watering_frequency: string;
}

interface LocationInfo {
  climate_zone: string;
  season: string;
  temperature_range: string;
  humidity: string;
  soil_type: string;
}

interface RecommendationData {
  location_info: LocationInfo;
  recommended_plants: PlantRecommendation[];
  seasonal_tips: string;
  local_considerations: string;
}

export default function RecommendationsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);

  const requestLocation = async () => {
    try {
      setLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to get plant recommendations for your area.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      let fullAddress = '';
      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        fullAddress = `${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`.replace(/^,\s*|,\s*$/g, '');
        setAddress(fullAddress);
      }

      const recs = await getLocationRecommendations(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        fullAddress
      );
      setRecommendations(recs);

    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'Hard': return Colors.error;
      default: return Colors.gray;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '🟢';
      case 'Medium': return '🟡';
      case 'Hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Plant Recommendations</Text>
            <Text style={styles.headerSubtitle}>Perfect plants for your location</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!location && !loading && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.locationPrompt}
          >
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={60} color={Colors.primary} />
            </View>
            <Text style={styles.promptTitle}>Get Personalized Recommendations</Text>
            <Text style={styles.promptSubtitle}>
              We'll analyze your location's climate, soil, and growing conditions to recommend the best plants for you.
            </Text>
            
            <TouchableOpacity style={styles.locationButton} onPress={requestLocation}>
              <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.buttonGradient}>
                <Ionicons name="location-outline" size={20} color={Colors.white} />
                <Text style={styles.buttonText}>Get My Location</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <Loading message="Getting recommendations for your area..." />
          </View>
        )}

        {location && address && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.locationCard}
          >
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.locationText}>{address}</Text>
            </View>
          </MotiView>
        )}

        {recommendations && (
          <>
            {/* Climate Info */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 200 }}
              style={styles.climateCard}
            >
              <Text style={styles.cardTitle}>🌤️ Your Climate Zone</Text>
              <View style={styles.climateGrid}>
                <View style={styles.climateItem}>
                  <Text style={styles.climateLabel}>Zone</Text>
                  <Text style={styles.climateValue}>{recommendations.location_info.climate_zone}</Text>
                </View>
                <View style={styles.climateItem}>
                  <Text style={styles.climateLabel}>Season</Text>
                  <Text style={styles.climateValue}>{recommendations.location_info.season}</Text>
                </View>
                <View style={styles.climateItem}>
                  <Text style={styles.climateLabel}>Temperature</Text>
                  <Text style={styles.climateValue}>{recommendations.location_info.temperature_range}</Text>
                </View>
                <View style={styles.climateItem}>
                  <Text style={styles.climateLabel}>Humidity</Text>
                  <Text style={styles.climateValue}>{recommendations.location_info.humidity}</Text>
                </View>
              </View>
            </MotiView>

            {/* Recommended Plants */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 400 }}
              style={styles.plantsSection}
            >
              <Text style={styles.sectionTitle}>🌱 Recommended Plants</Text>
              
              {recommendations.recommended_plants.map((plant, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: 600 + index * 100 }}
                  style={styles.plantCard}
                >
                  <View style={styles.plantHeader}>
                    <View style={styles.plantTitleContainer}>
                      <Text style={styles.plantName}>{plant.name}</Text>
                      <Text style={styles.plantScientific}>{plant.scientific_name}</Text>
                    </View>
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyEmoji}>{getDifficultyIcon(plant.difficulty)}</Text>
                      <Text style={[styles.difficultyText, { color: getDifficultyColor(plant.difficulty) }]}>
                        {plant.difficulty}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.plantDetails}>
                    <View style={styles.plantRow}>
                      <Ionicons name="leaf-outline" size={16} color={Colors.primary} />
                      <Text style={styles.plantLabel}>Category:</Text>
                      <Text style={styles.plantValue}>{plant.category}</Text>
                    </View>
                    
                    <View style={styles.plantRow}>
                      <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                      <Text style={styles.plantLabel}>Best Season:</Text>
                      <Text style={styles.plantValue}>{plant.best_season}</Text>
                    </View>
                    
                    <View style={styles.plantRow}>
                      <Ionicons name="time-outline" size={16} color={Colors.primary} />
                      <Text style={styles.plantLabel}>Growth Time:</Text>
                      <Text style={styles.plantValue}>{plant.growth_time}</Text>
                    </View>
                    
                    <View style={styles.plantRow}>
                      <Ionicons name="water-outline" size={16} color={Colors.primary} />
                      <Text style={styles.plantLabel}>Watering:</Text>
                      <Text style={styles.plantValue}>{plant.watering_frequency}</Text>
                    </View>
                  </View>

                  <Text style={styles.plantBenefits}>{plant.benefits}</Text>
                  <Text style={styles.plantTips}>{plant.care_tips}</Text>
                </MotiView>
              ))}
            </MotiView>

            {/* Tips */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 800 }}
              style={styles.tipsCard}
            >
              <Text style={styles.cardTitle}>💡 Seasonal Tips</Text>
              <Text style={styles.tipsText}>{recommendations.seasonal_tips}</Text>
              
              <Text style={styles.cardTitle}>🏡 Local Considerations</Text>
              <Text style={styles.tipsText}>{recommendations.local_considerations}</Text>
            </MotiView>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

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
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  locationPrompt: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  locationIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  promptSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  locationButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    paddingVertical: 60,
  },
  locationCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginLeft: 8,
  },
  climateCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
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
    marginBottom: 15,
  },
  climateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  climateItem: {
    width: (width - 80) / 2,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 12,
  },
  climateLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  climateValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  plantsSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 15,
  },
  plantCard: {
    backgroundColor: Colors.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  plantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  plantTitleContainer: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  plantScientific: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  difficultyEmoji: {
    fontSize: 12,
    marginRight: 5,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  plantDetails: {
    marginBottom: 15,
  },
  plantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  plantLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
  },
  plantValue: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  plantBenefits: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  plantTips: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 10,
  },
  tipsCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  bottomPadding: {
    height: 100,
  },
});