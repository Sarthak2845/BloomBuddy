import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

interface PlantCardProps {
  name: string;
  scientific: string;
  family: string;
  region: string;
  description: string;
  careInstructions?: string;
  toxicity?: string;
  difficulty?: string;
  image?: string;
}

export default function PlantCard({
  name,
  scientific,
  family,
  region,
  description,
  careInstructions,
  toxicity,
  difficulty,
  image,
}: PlantCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': return Colors.success;
      case 'medium': return Colors.warning;
      case 'hard': return Colors.error;
      default: return Colors.gray;
    }
  };

  const getDifficultyIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, rotateY: '90deg' }}
      animate={{ opacity: 1, scale: 1, rotateY: '0deg' }}
      transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 200 }}
      style={styles.card}
    >
      {/* Header with Image */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800, delay: 400 }}
        style={styles.header}
      >
        <LinearGradient
          colors={[Colors.primaryLight, Colors.secondary]}
          style={styles.imageContainer}
        >
          <Image
            source={
              image
                ? { uri: image }
                : { uri: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' }
            }
            style={styles.image}
          />
          <View style={styles.imageOverlay}>
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 800 }}
              style={styles.difficultyBadge}
            >
              <Text style={styles.difficultyEmoji}>{getDifficultyIcon(difficulty)}</Text>
              <Text style={styles.difficultyText}>{difficulty || 'Unknown'}</Text>
            </MotiView>
          </View>
        </LinearGradient>
      </MotiView>

      {/* Plant Info */}
      <View style={styles.content}>
        <MotiText
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 600 }}
          style={styles.plantName}
        >
          {name || 'Unknown Plant'}
        </MotiText>

        <MotiText
          from={{ opacity: 0, translateX: -15 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 700 }}
          style={styles.scientific}
        >
          {scientific}
        </MotiText>

        {/* Basic Info Cards */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
          style={styles.infoGrid}
        >
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🌿</Text>
            <Text style={styles.infoLabel}>Family</Text>
            <Text style={styles.infoValue}>{family}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🌍</Text>
            <Text style={styles.infoLabel}>Origin</Text>
            <Text style={styles.infoValue}>{region}</Text>
          </View>
        </MotiView>

        {/* Toxicity Warning */}
        {toxicity && (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 900 }}
            style={styles.warningCard}
          >
            <Ionicons name="warning" size={16} color={Colors.warning} />
            <Text style={styles.warningText}>{toxicity}</Text>
          </MotiView>
        )}

        {/* Description */}
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 1000 }}
        >
          <Text style={styles.description}>{description}</Text>
        </MotiView>

        {/* Toggle Details Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 1100 }}
        >
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.detailsButtonText}>
              {showDetails ? 'Hide Care Instructions' : 'Show Care Instructions'}
            </Text>
            <Ionicons 
              name={showDetails ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        </MotiView>

        {/* Care Instructions (Expandable) */}
        {showDetails && careInstructions && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.careSection}
          >
            <LinearGradient
              colors={[Colors.cardSecondary, Colors.lightGray]}
              style={styles.careCard}
            >
              <View style={styles.careHeader}>
                <Ionicons name="leaf" size={20} color={Colors.success} />
                <Text style={styles.careTitle}>Care Instructions</Text>
              </View>
              <Text style={styles.careText}>{careInstructions}</Text>
            </LinearGradient>
          </MotiView>
        )}
      </View>

      {/* Floating Animation Elements */}
      {[...Array(3)].map((_, i) => (
        <MotiView
          key={i}
          from={{ translateY: -10, opacity: 0, rotate: '0deg' }}
          animate={{ translateY: 10, opacity: 0.6, rotate: '360deg' }}
          transition={{
            type: 'timing',
            duration: 4000 + i * 500,
            loop: true,
            delay: i * 1000,
            repeatReverse: true,
          }}
          style={[styles.floatingElement, { 
            right: 20 + i * 30, 
            top: 50 + i * 40 
          }]}
        >
          <Text style={styles.floatingEmoji}>
            {['🌸', '🍃', '🌺'][i]}
          </Text>
        </MotiView>
      ))}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    height: 200,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    padding: 20,
  },
  plantName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  scientific: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  detailsButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: 8,
  },
  careSection: {
    marginTop: 8,
  },
  careCard: {
    borderRadius: 16,
    padding: 16,
  },
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  careTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 8,
  },
  careText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  floatingElement: {
    position: 'absolute',
  },
  floatingEmoji: {
    fontSize: 16,
    opacity: 0.7,
  },
});