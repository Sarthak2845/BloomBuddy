import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { identifyPlant, identifyPlantByName, savePlantRecord } from '@/lib/services/plantService';
import { getAuth, signInAnonymously } from 'firebase/auth';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [plantName, setPlantName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();



  // Remove Firebase dependency for now
  const ensureAuthenticated = async () => {
    // Skip authentication for demo
    return true;
  };

  const handleIdentifyPlant = async (source: 'name' | 'image') => {
    if (source === 'name' && !plantName.trim()) {
      Alert.alert('Error', 'Please enter a plant name');
      return;
    }
    
    if (source === 'image' && !image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }
    
    setLoading(true);
    
    try {
      // Ensure user is authenticated (anonymously if needed)
      await ensureAuthenticated();
      
      if (source === 'image' && image) {
        const imageFile = {
          uri: image,
          name: 'plant_image.jpg',
          type: 'image/jpeg'
        };
        
        const result = await identifyPlant([imageFile]);
        
        try {
          await savePlantRecord(result, image, 'camera');
        } catch (saveError) {
          console.warn('Failed to save plant record:', saveError);
        }
        
        // Navigate to result screen
        router.push({
          pathname: '/(tabs)/result',
          params: {
            plantData: JSON.stringify(result),
            imageUri: image,
            source: 'image'
          },
        });
      } else if (source === 'name' && plantName.trim()) {
        const result = await identifyPlantByName(plantName.trim());
        
        try {
          await savePlantRecord(result, '', 'gallery');
        } catch (saveError) {
          console.warn('Failed to save plant record:', saveError);
        }
        
        router.push({
          pathname: '/(tabs)/result',
          params: {
            plantData: JSON.stringify(result),
            imageUri: '',
            source: 'name'
          },
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to identify plant. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async (fromGallery = false) => {
    try {
      let permissionResult;
      
      if (fromGallery) {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      }
      
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission needed', `Please grant ${fromGallery ? 'photo library' : 'camera'} permissions to use this feature.`);
        return;
      }

      const picker = fromGallery
        ? ImagePicker.launchImageLibraryAsync
        : ImagePicker.launchCameraAsync;

      const result = await picker({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to access camera/gallery. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <Text style={styles.greeting}>Hello Plant Lover! 🌱</Text>
          <Text style={styles.title}>Discover Your Plant</Text>
          <Text style={styles.subtitle}>Identify any plant with AI-powered recognition</Text>
        </MotiView>

        {/* Search Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 200 }}
          style={styles.searchSection}
        >
          <Text style={styles.sectionTitle}>🔍 Search by Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              placeholder="Enter plant name"
              placeholderTextColor={Colors.textLight}
              style={styles.input}
              value={plantName}
              onChangeText={setPlantName}
            />
          </View>
          <TouchableOpacity
            style={[styles.searchButton, !plantName.trim() && styles.disabledButton]}
            onPress={() => handleIdentifyPlant('name')}
            disabled={!plantName.trim() || loading}
          >
            <LinearGradient
              colors={!plantName.trim() ? [Colors.gray, Colors.gray] : [Colors.primary, Colors.primaryLight]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Identify Plant</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {/* Divider */}
        <MotiView
          from={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ type: 'timing', duration: 800, delay: 400 }}
          style={styles.divider}
        >
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </MotiView>

        {/* Camera Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 600 }}
          style={styles.cameraSection}
        >
          <Text style={styles.sectionTitle}>📸 Identify by Photo</Text>
          <Text style={styles.sectionSubtitle}>Take a photo or choose from gallery</Text>
          
          <View style={styles.cameraButtons}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => handleImagePick(false)}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.accent, '#FF8C42']}
                style={styles.cameraButtonGradient}
              >
                <Ionicons name="camera" size={24} color={Colors.white} />
                <Text style={styles.cameraButtonText}>Take Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => handleImagePick(true)}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.success, '#20C997']}
                style={styles.cameraButtonGradient}
              >
                <Ionicons name="images" size={24} color={Colors.white} />
                <Text style={styles.cameraButtonText}>Gallery</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Image Preview */}
        {image && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.imagePreview}
          >
            <Text style={styles.previewTitle}>Selected Image</Text>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.identifyImageButton}
              onPress={() => handleIdentifyPlant('image')}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.success, '#20C997']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Identify This Plant</Text>
                <Ionicons name="leaf" size={20} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Quick Access Features */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
          style={styles.quickAccessSection}
        >
          <Text style={styles.quickAccessTitle}>🚀 Quick Access</Text>
          
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => router.push('/recommendations')}
            >
              <LinearGradient
                colors={[Colors.success, '#20C997']}
                style={styles.quickAccessGradient}
              >
                <Ionicons name="location" size={28} color={Colors.white} />
                <Text style={styles.quickAccessCardTitle}>Location Plants</Text>
                <Text style={styles.quickAccessSubtitle}>Perfect for your area</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => router.push('/reminders')}
            >
              <LinearGradient
                colors={[Colors.accent, '#FF8C42']}
                style={styles.quickAccessGradient}
              >
                <Ionicons name="water" size={28} color={Colors.white} />
                <Text style={styles.quickAccessCardTitle}>Water Reminders</Text>
                <Text style={styles.quickAccessSubtitle}>Never miss watering</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => router.push('/(tabs)/collection')}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={styles.quickAccessGradient}
              >
                <Ionicons name="leaf" size={28} color={Colors.white} />
                <Text style={styles.quickAccessCardTitle}>My Plants</Text>
                <Text style={styles.quickAccessSubtitle}>View collection</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAccessCard}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                style={styles.quickAccessGradient}
              >
                <Ionicons name="person" size={28} color={Colors.white} />
                <Text style={styles.quickAccessCardTitle}>Profile</Text>
                <Text style={styles.quickAccessSubtitle}>Settings & stats</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Feature Highlights */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 900 }}
          style={styles.highlightsSection}
        >
          <Text style={styles.highlightsTitle}>✨ New Features</Text>
          
          <TouchableOpacity
            style={styles.highlightCard}
            onPress={() => router.push('/recommendations')}
          >
            <View style={styles.highlightIcon}>
              <Ionicons name="location" size={24} color={Colors.success} />
            </View>
            <View style={styles.highlightContent}>
              <Text style={styles.highlightTitle}>Smart Plant Recommendations</Text>
              <Text style={styles.highlightSubtitle}>Get personalized plant suggestions based on your location's climate and growing conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.highlightCard}
            onPress={() => router.push('/reminders')}
          >
            <View style={styles.highlightIcon}>
              <Ionicons name="water" size={24} color={Colors.accent} />
            </View>
            <View style={styles.highlightContent}>
              <Text style={styles.highlightTitle}>Watering Reminders</Text>
              <Text style={styles.highlightSubtitle}>Set custom watering schedules for your plants and never forget to water them again</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </MotiView>

        {/* Quick Tips */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 1000 }}
          style={styles.tipsSection}
        >
          <Text style={styles.tipsTitle}>💡 Tips for Better Results</Text>
          <View style={styles.tipsList}>
            <View style={styles.tip}>
              <Text style={styles.tipEmoji}>🌿</Text>
              <Text style={styles.tipText}>Capture clear, well-lit photos</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipEmoji}>🔍</Text>
              <Text style={styles.tipText}>Focus on leaves and flowers</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipEmoji}>📏</Text>
              <Text style={styles.tipText}>Fill the frame with the plant</Text>
            </View>
          </View>
        </MotiView>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={styles.loadingContainer}
            >
              <Loading />
              <Text style={styles.loadingText}>🌱 Analyzing your plant...</Text>
              <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
            </MotiView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: width * 0.05,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 22,
  },
  searchSection: {
    backgroundColor: Colors.card,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  searchButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600',
  },
  cameraSection: {
    backgroundColor: Colors.card,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cameraButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cameraButtonGradient: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  cameraButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  imagePreview: {
    backgroundColor: Colors.card,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
  },
  previewImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 15,
  },
  tipsSection: {
    backgroundColor: Colors.cardSecondary,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
  },
  tipsList: {
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.textLight,
  },
  identifyImageButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 15,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  quickAccessSection: {
    marginHorizontal: width * 0.05,
    marginBottom: 20,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 15,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    width: (width - (width * 0.1) - 12) / 2,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  quickAccessGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  quickAccessCardTitle: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
  quickAccessSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    textAlign: 'center',
  },
  highlightsSection: {
    marginHorizontal: width * 0.05,
    marginBottom: 20,
  },
  highlightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 15,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  highlightSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});