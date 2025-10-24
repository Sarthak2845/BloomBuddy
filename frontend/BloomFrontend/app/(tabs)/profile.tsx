import React, { useState } from 'react';
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
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

interface ProfileStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const profileStats: ProfileStat[] = [
  { label: 'Plants Identified', value: '47', icon: 'leaf', color: Colors.success },
  { label: 'Days Active', value: '23', icon: 'calendar', color: Colors.info },
  { label: 'Achievements', value: '8', icon: 'trophy', color: Colors.warning },
  { label: 'Streak', value: '5', icon: 'flame', color: Colors.error },
];

interface MenuItem {
  title: string;
  icon: string;
  action: () => void;
  showArrow?: boolean;
  color?: string;
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/auth/login')
        }
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      action: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!'),
    },
    {
      title: 'Plant Care Reminders',
      icon: 'notifications-outline',
      action: () => Alert.alert('Coming Soon', 'Care reminders will be available soon!'),
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
      color: Colors.error,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Profile Info */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight, Colors.secondary]}
          style={styles.header}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 200 }}
            style={styles.profileSection}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[Colors.accent, '#FF8C42']}
                style={styles.avatarGradient}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200' }}
                  style={styles.avatar}
                />
              </LinearGradient>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>Sarah Johnson</Text>
            <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
            <Text style={styles.userBio}>🌱 Plant enthusiast & nature lover</Text>
          </MotiView>

          {/* Floating Elements */}
          {[...Array(5)].map((_, i) => (
            <MotiView
              key={i}
              from={{ translateY: -20, opacity: 0 }}
              animate={{ translateY: 20, opacity: 0.3 }}
              transition={{
                type: 'timing',
                duration: 3000 + i * 500,
                loop: true,
                delay: i * 800,
                repeatReverse: true,
              }}
              style={[styles.floatingElement, { 
                left: 30 + i * 70, 
                top: 50 + (i % 2) * 100 
              }]}
            >
              <Text style={styles.floatingEmoji}>
                {['🌿', '🌸', '🍃', '🌺', '🌻'][i]}
              </Text>
            </MotiView>
          ))}
        </LinearGradient>

        {/* Stats Section */}
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
                  <Ionicons name={stat.icon as any} size={24} color={Colors.white} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Settings Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 800 }}
          style={styles.settingsSection}
        >
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {/* Toggle Settings */}
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.lightGray, true: Colors.primaryLight }}
                thumbColor={notificationsEnabled ? Colors.primary : Colors.gray}
              />
            </View>
            
            <View style={styles.settingDivider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon-outline" size={20} color={Colors.primary} />
                <Text style={styles.settingTitle}>Dark Mode</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: Colors.lightGray, true: Colors.primaryLight }}
                thumbColor={darkModeEnabled ? Colors.primary : Colors.gray}
              />
            </View>
          </View>
        </MotiView>

        {/* Menu Section */}
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
                      color={item.color || Colors.textSecondary} 
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
                    color={Colors.textLight} 
                  />
                </TouchableOpacity>
                {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
              </View>
            ))}
          </View>
        </MotiView>

        {/* App Version */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  avatarGradient: {
    padding: 4,
    borderRadius: 60,
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
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
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
  floatingElement: {
    position: 'absolute',
  },
  floatingEmoji: {
    fontSize: 20,
    opacity: 0.6,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: -20,
    zIndex: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
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
    color: Colors.white,
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
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
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
    color: Colors.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 4,
    shadowColor: Colors.shadow,
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
    color: Colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 48,
  },
  versionSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: Colors.textLight,
  },
  bottomPadding: {
    height: 120,
  },
});