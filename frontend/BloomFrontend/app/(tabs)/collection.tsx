import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { getUserPlants, PlantRecord } from '@/lib/services/plantService';
import Loading from '@/components/Loading';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');



export default function CollectionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [plants, setPlants] = useState<PlantRecord[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlants = async () => {
    try {
      const userPlants = await getUserPlants();
      setPlants(userPlants);
    } catch (error) {
      console.error('Error loading plants:', error);
      setPlants([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlants();
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.7) return 'High';
    if (score >= 0.4) return 'Medium';
    return 'Low';
  };

  const handlePlantPress = (plant: PlantRecord) => {
    router.push({
      pathname: '/plant-detail',
      params: { plantId: plant.id }
    });
  };

  const filteredPlants = plants.filter(plant => {
    const commonName = plant.common_names?.[0] || plant.scientific_name;
    const matchesSearch = commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase());
    const confidenceLevel = getConfidenceLevel(plant.identification_data.confidence_score);
    const matchesFilter = selectedFilter === 'All' || confidenceLevel === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getConfidenceColor = (score: number) => {
    if (score >= 0.7) return Colors.success;
    if (score >= 0.4) return Colors.warning;
    return Colors.error;
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.7) return '🟢';
    if (score >= 0.4) return '🟡';
    return '🔴';
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Loading />
        <Text style={styles.loadingText}>Loading your collection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.header}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
        >
          <Text style={styles.headerTitle}>My Plant Collection</Text>
          <Text style={styles.headerSubtitle}>{plants.length} plants identified</Text>
        </MotiView>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Search and Filter */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 200 }}
          style={styles.searchSection}
        >
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your plants..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {['All', 'High', 'Medium', 'Low'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.activeFilterButton
                ]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                {selectedFilter === filter && (
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryLight]}
                    style={styles.filterGradient}
                  />
                )}
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </MotiView>

        {/* Stats Cards */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.success, '#20C997']}
              style={styles.statGradient}
            >
              <Text style={styles.statNumber}>{plants.filter(p => getConfidenceLevel(p.identification_data.confidence_score) === 'High').length}</Text>
              <Text style={styles.statLabel}>High Confidence</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.warning, '#FFB347']}
              style={styles.statGradient}
            >
              <Text style={styles.statNumber}>{plants.filter(p => getConfidenceLevel(p.identification_data.confidence_score) === 'Medium').length}</Text>
              <Text style={styles.statLabel}>Medium Confidence</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.error, '#FF6B6B']}
              style={styles.statGradient}
            >
              <Text style={styles.statNumber}>{plants.filter(p => getConfidenceLevel(p.identification_data.confidence_score) === 'Low').length}</Text>
              <Text style={styles.statLabel}>Low Confidence</Text>
            </LinearGradient>
          </View>
        </MotiView>

        {/* Plants Grid */}
        <View style={styles.plantsGrid}>
          {filteredPlants.map((plant, index) => (
            <MotiView
              key={plant.id}
              from={{ opacity: 0, scale: 0.8, rotateY: '90deg' }}
              animate={{ opacity: 1, scale: 1, rotateY: '0deg' }}
              transition={{ 
                type: 'spring', 
                damping: 15, 
                delay: 600 + index * 100 
              }}
              style={styles.plantCard}
            >
              <TouchableOpacity activeOpacity={0.8} onPress={() => handlePlantPress(plant)}>
                <View style={styles.plantImageContainer}>
                  <Image source={{ uri: plant.media.primary_image }} style={styles.plantImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.plantImageOverlay}
                  />
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyEmoji}>{getConfidenceIcon(plant.identification_data.confidence_score)}</Text>
                  </View>
                  {plant.is_favorite && (
                    <View style={styles.favoriteIcon}>
                      <Ionicons name="heart" size={16} color={Colors.error} />
                    </View>
                  )}
                </View>
                
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName} numberOfLines={1}>
                    {plant.common_names?.[0] || plant.scientific_name}
                  </Text>
                  <Text style={styles.plantScientific} numberOfLines={1}>{plant.scientific_name}</Text>
                  <Text style={styles.plantFamily}>{plant.family}</Text>
                  
                  <View style={styles.plantMeta}>
                    <Ionicons name="analytics-outline" size={12} color={Colors.textLight} />
                    <Text style={styles.plantDate}>
                      {Math.round(plant.identification_data.confidence_score * 100)}% confidence
                    </Text>
                  </View>
                  
                  {plant.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {plant.tags.slice(0, 2).map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>

        {/* Empty State */}
        {filteredPlants.length === 0 && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.emptyState}
          >
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No plants found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Start identifying plants to build your collection'}
            </Text>
          </MotiView>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  activeFilterButton: {
    borderColor: Colors.primary,
  },
  filterGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },
  plantCard: {
    width: (width - 56) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plantImageContainer: {
    position: 'relative',
    height: 120,
  },
  plantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  plantImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyEmoji: {
    fontSize: 12,
  },
  plantInfo: {
    padding: 12,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  plantScientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  plantFamily: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 8,
  },
  plantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantDate: {
    fontSize: 11,
    color: Colors.textLight,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 120,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
});