import React, { useState } from 'react';
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
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface PlantItem {
  id: string;
  name: string;
  scientific: string;
  family: string;
  dateAdded: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const mockPlants: PlantItem[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    scientific: 'Monstera deliciosa',
    family: 'Araceae',
    dateAdded: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    difficulty: 'Easy',
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    scientific: 'Ficus lyrata',
    family: 'Moraceae',
    dateAdded: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400',
    difficulty: 'Hard',
  },
  {
    id: '3',
    name: 'Snake Plant',
    scientific: 'Sansevieria trifasciata',
    family: 'Asparagaceae',
    dateAdded: '2024-01-08',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
    difficulty: 'Easy',
  },
  {
    id: '4',
    name: 'Peace Lily',
    scientific: 'Spathiphyllum wallisii',
    family: 'Araceae',
    dateAdded: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    difficulty: 'Medium',
  },
];

export default function CollectionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const filteredPlants = mockPlants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.scientific.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || plant.difficulty === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
          <Text style={styles.headerSubtitle}>{mockPlants.length} plants identified</Text>
        </MotiView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            {['All', 'Easy', 'Medium', 'Hard'].map((filter) => (
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
              <Text style={styles.statNumber}>{mockPlants.filter(p => p.difficulty === 'Easy').length}</Text>
              <Text style={styles.statLabel}>Easy Care</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.warning, '#FFB347']}
              style={styles.statGradient}
            >
              <Text style={styles.statNumber}>{mockPlants.filter(p => p.difficulty === 'Medium').length}</Text>
              <Text style={styles.statLabel}>Medium Care</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.error, '#FF6B6B']}
              style={styles.statGradient}
            >
              <Text style={styles.statNumber}>{mockPlants.filter(p => p.difficulty === 'Hard').length}</Text>
              <Text style={styles.statLabel}>Hard Care</Text>
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
              <TouchableOpacity activeOpacity={0.8}>
                <View style={styles.plantImageContainer}>
                  <Image source={{ uri: plant.image }} style={styles.plantImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.plantImageOverlay}
                  />
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyEmoji}>{getDifficultyIcon(plant.difficulty)}</Text>
                  </View>
                </View>
                
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                  <Text style={styles.plantScientific} numberOfLines={1}>{plant.scientific}</Text>
                  <Text style={styles.plantFamily}>{plant.family}</Text>
                  
                  <View style={styles.plantMeta}>
                    <Ionicons name="calendar-outline" size={12} color={Colors.textLight} />
                    <Text style={styles.plantDate}>
                      {new Date(plant.dateAdded).toLocaleDateString()}
                    </Text>
                  </View>
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
});