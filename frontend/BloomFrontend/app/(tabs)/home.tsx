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

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [plantName, setPlantName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const mockPlantData = {
    name: 'Monstera Deliciosa',
    scientific: 'Monstera deliciosa Liebm.',
    family: 'Araceae',
    region: 'Central America, found in tropical rainforests',
    description: 'Known as the Swiss Cheese Plant, this popular houseplant features large, glossy leaves with natural holes. It\'s perfect for indoor spaces and can grow quite large with proper care.',
    careInstructions: 'Water when top soil is dry, provide bright indirect light, and maintain humidity above 50%.',
    toxicity: 'Toxic to pets and children if ingested',
    difficulty: 'Easy',
  };

  const identifyPlant = async (source: 'name' | 'image') => {
    if (source === 'name' && !plantName.trim()) {
      Alert.alert('Please enter a plant name');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(tabs)/result',
        params: {
          ...mockPlantData,
          from: source,
          img: image,
        },
      });
    }, 2500);
  };

  const handleImagePick = async (fromGallery = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
      return;
    }

    const picker = fromGallery
      ? ImagePicker.launchImageLibraryAsync
      : ImagePicker.launchCameraAsync;

    const result = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      identifyPlant('image');
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
            onPress={() => identifyPlant('name')}
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
          </MotiView>
        )}

        {/* Quick Tips */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
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
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
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
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
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
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
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
    width: width - 80,
    height: width - 80,
    borderRadius: 15,
  },
  tipsSection: {
    backgroundColor: Colors.cardSecondary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
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
});