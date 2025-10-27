import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Switch,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getUserProfile, updateUserProfile, logOut, UserProfile, generateProfilePicture } from '@/lib/services/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { getUserPlants, getUserPlantsCount } from '@/lib/services/plantService';
import Loading from '@/components/Loading';

interface ProfileStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface MenuItem {
  title: string;
  icon: string;
  action: () => void;
  showArrow?: boolean;
  color?: string;
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [plantCount, setPlantCount] = useState(0);
  const router = useRouter();
  const auth = getAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const styles = createStyles(theme);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        setUserProfile(null);
        setPlantCount(0);
        return;
      }

      let profile = await getUserProfile(user.uid);
      
      if (!profile) {
        const displayName = user.displayName || 'Plant Lover';
        const photoURL = user.photoURL || generateProfilePicture(displayName);
        
        profile = {
          uid: user.uid,
          email: user.email || 'user@bloombuddy.com',
          displayName,
          photoURL,
          bio: '🌱 Plant enthusiast & nature lover',
          plantsIdentified: 0,
          daysActive: 1,
          achievements: [],
          streak: 0,
          joinedAt: new Date(),
          lastActive: new Date(),
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'en'
          }
        };
        
        try {
          await updateUserProfile(user.uid, profile);
        } catch (saveError) {
          console.log('Could not save new profile:', saveError);
        }
      } else {
        if (!profile.photoURL) {
          profile.photoURL = generateProfilePicture(profile.displayName || profile.email);
          try {
            await updateUserProfile(user.uid, { photoURL: profile.photoURL });
          } catch (updateError) {
            console.log('Could not update profile photo:', updateError);
          }
        }
      }
      
      setUserProfile(profile);
      const count = await getUserPlantsCount(user.uid);
      setPlantCount(count);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserProfile(null);
      setPlantCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const updatePreference = async (key: keyof UserProfile['preferences'], value: any) => {
    if (!userProfile || !auth.currentUser) return;
    
    try {
      const updatedPreferences = { ...userProfile.preferences, [key]: value };
      await updateUserProfile(userProfile.uid, { preferences: updatedPreferences });
      setUserProfile({ ...userProfile, preferences: updatedPreferences });
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logOut();
              router.replace('/');
            } catch (error) {
              console.log('Logout error:', error);
              router.replace('/');
            }
          }
        }
      ]
    );
  };

  const calculateDaysActive = () => {
    if (!userProfile?.joinedAt) return 0;
    const joinDate = userProfile.joinedAt.toDate ? userProfile.joinedAt.toDate() : new Date(userProfile.joinedAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Loading message="Loading your profile..." />
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Loading message="Loading your profile..." />
      </View>
    );
  }

  const profileStats: ProfileStat[] = [
    { label: 'Plants Identified', value: plantCount.toString(), icon: 'leaf', color: theme.success },
    { label: 'Days Active', value: calculateDaysActive().toString(), icon: 'calendar', color: theme.info },
    { label: 'Achievements', value: (userProfile.achievements || []).length.toString(), icon: 'trophy', color: theme.warning },
    { label: 'Streak', value: (userProfile.streak || 0).toString(), icon: 'flame', color: theme.error },
  ];

  const menuItems: MenuItem[] = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      action: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!'),
    },
    {
      title: 'Plant Recommendations',
      icon: 'leaf-outline',
      action: () => router.push('/recommendations'),
    },
    {
      title: 'Plant Care Reminders',
      icon: 'notifications-outline',
      action: () => router.push('/reminders'),
    },
    {
      title: 'Achievements',
      icon: 'trophy-outline',
      action: () => Alert.alert('Coming Soon', 'Achievements system coming soon!'),
    },
    {
      title: 'Plant Encyclopedia',
      icon: 'library-outline',
      action: () => Alert.alert('Coming Soon', 'Plant encyclopedia coming soon!'),
    },
    {
      title: 'Share App',
      icon: 'share-outline',
      action: () => Alert.alert('Share', 'Share BloomBuddy with your friends!'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: () => Alert.alert('Help', 'Contact us at support@bloombuddy.com'),
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-outline',
      action: () => Alert.alert('Privacy', 'Privacy policy will be shown here'),
    },
    {
      title: 'Logout',
      icon: 'log-out-outline',
      action: handleLogout,
      color: theme.error,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.primary} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        <LinearGradient
          colors={['#56ab2f','#a8e063']}
          style={styles.header}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 200 }}
            style={styles.profileSection}
          >
            <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: userProfile?.photoURL || generateProfilePicture(userProfile?.displayName || 'User') }}
                  style={styles.avatar}
                />

              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={theme.white} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>{userProfile.displayName || 'Plant Lover'}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <Text style={styles.userBio}>{userProfile.bio || '🌱 Plant enthusiast & nature lover'}</Text>
          </MotiView>
        </LinearGradient>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          style={styles.statsSection}
        >
          <Text style={styles.sectionTitle}>Your Plant Journey</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <MotiView
                key={stat.label}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: 'spring', 
                  damping: 15, 
                  delay: 600 + index * 100 
                }}
                style={styles.statCard}
              >
                <LinearGradient
                  colors={[stat.color, `${stat.color}CC`]}
                  style={styles.statGradient}
                >
                  <Ionicons name={stat.icon as any} size={24} color={theme.white} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
              </MotiView>
            ))}
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
          style={styles.settingsSection}
        >
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={20} color={theme.primary} />
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={userProfile.preferences?.notifications || false}
                onValueChange={(value) => updatePreference('notifications', value)}
                trackColor={{ false: theme.lightGray, true: theme.primaryLight }}
                thumbColor={userProfile.preferences?.notifications ? theme.primary : theme.gray}
              />
            </View>
            
            <View style={styles.settingDivider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon-outline" size={20} color={theme.primary} />
                <Text style={styles.settingTitle}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.lightGray, true: theme.primaryLight }}
                thumbColor={isDark ? theme.primary : theme.gray}
              />
            </View>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 1000 }}
          style={styles.menuSection}
        >
          <Text style={styles.sectionTitle}>More Options</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <View key={item.title}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuLeft}>
                    <Ionicons 
                      name={item.icon as any} 
                      size={20} 
                      color={item.color || theme.textSecondary} 
                    />
                    <Text style={[
                      styles.menuTitle,
                      item.color && { color: item.color }
                    ]}>
                      {item.title}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={16} 
                    color={theme.textLight} 
                  />
                </TouchableOpacity>
                {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
              </View>
            ))}
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 1200 }}
          style={styles.versionSection}
        >
          <Text style={styles.versionText}>BloomBuddy v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with 💚 for plant lovers</Text>
        </MotiView>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
  },
  profileSection: {
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    zIndex: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.white,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingsCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  settingDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 16,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 4,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginLeft: 48,
  },
  versionSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: theme.textLight,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: theme.textLight,
  },
  bottomPadding: {
    height: 120,
  },
});