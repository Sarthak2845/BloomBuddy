import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Share,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import PlantCard from '../../components/PlantCard';

export default function ResultScreen() {
  const router = useRouter();
  const { 
    name, 
    scientific, 
    family, 
    region, 
    description, 
    careInstructions,
    toxicity,
    difficulty,
    img 
  } = useLocalSearchParams();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this plant I identified with BloomBuddy!\n\n🌱 ${name}\n🔬 ${scientific}\n🌿 Family: ${family}\n\n${description}`,
        title: `${name} - Plant Identification`,
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
        {/* Plant Card */}
        <PlantCard
          name={name as string}
          scientific={scientific as string}
          family={family as string}
          region={region as string}
          description={description as string}
          careInstructions={careInstructions as string}
          toxicity={toxicity as string}
          difficulty={difficulty as string}
          image={img as string}
        />

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
            <TouchableOpacity style={styles.secondaryAction}>
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
});