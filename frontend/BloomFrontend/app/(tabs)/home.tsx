import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, StatusBar, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import Loading from '@/components/Loading';
import { identifyPlant, identifyPlantByName, savePlantRecord } from '@/lib/services/plantService';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [plantName, setPlantName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  const handleIdentifyPlant = async (source: 'name' | 'image') => {
    if ((source === 'name' && !plantName.trim()) || (source === 'image' && !image)) {
      Alert.alert('Error', `Please ${source === 'name' ? 'enter a plant name' : 'select an image'}`);
      return;
    }

    const auth = getAuth();
    if (!auth.currentUser) {
      Alert.alert('Authentication Required', 'Please sign in to identify plants.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (source === 'image' && image) {
        const imageFile = { uri: image, name: 'plant_image.jpg', type: 'image/jpeg' };
        result = await identifyPlant([imageFile]);
        await savePlantRecord(result, image, 'camera');
      } else {
        result = await identifyPlantByName(plantName.trim());
        await savePlantRecord(result, '', 'gallery');
      }

      router.push({
        pathname: '/(tabs)/result',
        params: {
          plantData: JSON.stringify(result),
          imageUri: image || '',
          source,
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to identify plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (fromGallery = false) => {
    try {
      const permission = fromGallery
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', `Grant ${fromGallery ? 'photo library' : 'camera'} access.`);
        return;
      }

      const result = await (fromGallery ? ImagePicker.launchImageLibraryAsync : ImagePicker.launchCameraAsync)({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) setImage(result.assets[0].uri);
    } catch (err) {
      Alert.alert('Error', 'Failed to access camera/gallery.');
    }
  };

  const ActionButton = ({ title, onPress, icon, disabled = false, colors }: any) => (
    <TouchableOpacity style={[styles.actionButton, disabled && styles.disabledButton]} onPress={onPress} disabled={disabled}>
      <LinearGradient colors={colors} style={styles.buttonGradient}>
        <Text style={styles.buttonText}>{title}</Text>
        {icon && <Ionicons name={icon} size={20} color={theme.white} />}
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickAccessCard = ({ title, subtitle, icon, colors, onPress }: any) => (
    <TouchableOpacity style={styles.quickAccessCard} onPress={onPress}>
      <LinearGradient colors={colors} style={styles.quickAccessGradient}>
        <Ionicons name={icon} size={28} color={theme.white} />
        <Text style={styles.quickAccessCardTitle}>{title}</Text>
        <Text style={styles.quickAccessSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const HighlightCard = ({ title, subtitle, icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.highlightCard} onPress={onPress}>
      <View style={styles.highlightIcon}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.highlightContent}>
        <Text style={styles.highlightTitle}>{title}</Text>
        <Text style={styles.highlightSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textLight} />
    </TouchableOpacity>
  );

  const TipItem = ({ emoji, text }: any) => (
    <View style={styles.tip}>
      <Text style={styles.tipEmoji}>{emoji}</Text>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 600 }} style={styles.header}>
          <Text style={styles.greeting}>Hello Plant Lover! 🌱</Text>
          <Text style={styles.title}>Discover Your Plant</Text>
          <Text style={styles.subtitle}>Identify any plant with AI-powered recognition</Text>
        </MotiView>

        <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 15, delay: 200 }} style={styles.searchSection}>
          <Text style={styles.sectionTitle}>🔍 Search by Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color={theme.textLight} style={styles.searchIcon} />
            <TextInput placeholder="Enter plant name" placeholderTextColor={theme.textLight} style={styles.input} value={plantName} onChangeText={setPlantName} />
          </View>
          <ActionButton
            title="Identify Plant"
            onPress={() => handleIdentifyPlant('name')}
            icon="arrow-forward"
            disabled={!plantName.trim() || loading}
            colors={!plantName.trim() ? [theme.gray, theme.gray] : [theme.primary, theme.primaryLight]}
          />
        </MotiView>

        <MotiView from={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 800, delay: 400 }} style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 600, delay: 600 }} style={styles.cameraSection}>
          <Text style={styles.sectionTitle}>📸 Identify by Photo</Text>
          <Text style={styles.sectionSubtitle}>Take a photo or choose from gallery</Text>
          <View style={styles.cameraButtons}>
            <ActionButton title="Take Photo" icon="camera" onPress={() => pickImage(false)} colors={[theme.accent, theme.accentLight]} disabled={loading} />
            <ActionButton title="Gallery" icon="images" onPress={() => pickImage(true)} colors={[theme.success, '#20C997']} disabled={loading} />
          </View>
        </MotiView>

        {image && (
          <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 15 }} style={styles.imagePreview}>
            <Text style={styles.previewTitle}>Selected Image</Text>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <ActionButton title="Identify This Plant" icon="leaf" onPress={() => handleIdentifyPlant('image')} colors={[theme.success, '#20C997']} />
          </MotiView>
        )}

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 600, delay: 800 }} style={styles.quickAccessSection}>
          <Text style={styles.quickAccessTitle}>🚀 Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            <QuickAccessCard title="Location Plants" subtitle="Perfect for your area" icon="location" colors={[theme.success, '#20C997']} onPress={() => router.push('/recommendations')} />
            <QuickAccessCard title="Water Reminders" subtitle="Never miss watering" icon="water" colors={['#007CF0', '#00DFD8']} onPress={() => router.push('/reminders')} />
            <QuickAccessCard title="My Plants" subtitle="View collection" icon="leaf" colors={['#A855F7', '#EC4899']} onPress={() => router.push('/(tabs)/collection')} />
            <QuickAccessCard title="Profile" subtitle="Settings & stats" icon="person" colors={['#FF5F6D', '#FFC371']} onPress={() => router.push('/(tabs)/profile')} />
          </View>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 600, delay: 900 }} style={styles.highlightsSection}>
          <Text style={styles.highlightsTitle}>✨ New Features</Text>
          <HighlightCard
            title="Smart Plant Recommendations"
            subtitle="Get personalized plant suggestions based on your location's climate and growing conditions"
            icon="location"
            color={theme.success}
            onPress={() => router.push('/recommendations')}
          />
          <HighlightCard
            title="Watering Reminders"
            subtitle="Set custom watering schedules for your plants and never forget to water them again"
            icon="water"
            color={theme.accent}
            onPress={() => router.push('/reminders')}
          />
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 600, delay: 1000 }} style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for Better Results</Text>
          <TipItem emoji="🌿" text="Capture clear, well-lit photos" />
          <TipItem emoji="🔍" text="Focus on leaves and flowers" />
          <TipItem emoji="📏" text="Fill the frame with the plant" />
        </MotiView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 15 }} style={styles.loadingContainer}>
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

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: width * 0.05, paddingTop: 60, paddingBottom: 30 },
  greeting: { fontSize: 16, color: theme.textSecondary, marginBottom: 5 },
  title: { fontSize: Math.min(32, width * 0.08), fontWeight: '800', color: theme.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.textLight, lineHeight: 22 },
  searchSection: { backgroundColor: theme.card, marginHorizontal: width * 0.05, borderRadius: 20, padding: width * 0.05, marginBottom: 20, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 15 },
  sectionSubtitle: { fontSize: 14, color: theme.textLight, marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.lightGray, borderRadius: 15, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: theme.border },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: theme.text },
  actionButton: { borderRadius: 15, overflow: 'hidden', marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  buttonText: { color: theme.white, fontSize: 16, fontWeight: '600', marginRight: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.border },
  dividerText: { marginHorizontal: 15, fontSize: 14, color: theme.textLight, fontWeight: '600' },
  cameraSection: { backgroundColor: theme.card, marginHorizontal: width * 0.05, borderRadius: 20, padding: width * 0.05, marginBottom: 20, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cameraButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  imagePreview: { backgroundColor: theme.card, marginHorizontal: width * 0.05, borderRadius: 20, padding: width * 0.05, marginBottom: 20, alignItems: 'center', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  previewTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 15 },
  previewImage: { width: width * 0.8, height: width * 0.8, borderRadius: 15 },
  tipsSection: { backgroundColor: theme.cardSecondary, marginHorizontal: width * 0.05, borderRadius: 20, padding: width * 0.05, marginBottom: 20 },
  tipsTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 15 },
  tip: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tipEmoji: { fontSize: 16, marginRight: 12 },
  tipText: { fontSize: 14, color: theme.textSecondary, flex: 1 },
  loadingContainer: { alignItems: 'center', marginTop: 20, paddingHorizontal: 20 },
  loadingText: { marginTop: 15, fontSize: 18, color: theme.text, fontWeight: '600' },
  loadingSubtext: { marginTop: 5, fontSize: 14, color: theme.textLight },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  quickAccessSection: { marginHorizontal: width * 0.05, marginBottom: 20 },
  quickAccessTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 15 },
  quickAccessGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickAccessCard: { width: (width - width * 0.1 - 12) / 2, borderRadius: 15, overflow: 'hidden', shadowColor: theme.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 },
  quickAccessGradient: { padding: 16, alignItems: 'center', minHeight: 100, justifyContent: 'center' },
  quickAccessCardTitle: { color: theme.white, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 6, marginBottom: 2 },
  quickAccessSubtitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 11, textAlign: 'center' },
  highlightsSection: { marginHorizontal: width * 0.05, marginBottom: 20 },
  highlightsTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 15 },
  highlightCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 15, padding: 16, marginBottom: 12, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  highlightIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.lightGray, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  highlightContent: { flex: 1 },
  highlightTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 },
  highlightSubtitle: { fontSize: 13, color: theme.textSecondary, lineHeight: 18 },
});