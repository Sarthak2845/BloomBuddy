import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
              style={styles.tabBarGradient}
            />
          </View>
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Identify',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {focused && (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryLight]}
                  style={styles.activeIconBackground}
                />
              )}
              <Ionicons 
                name={focused ? "camera" : "camera-outline"} 
                size={24} 
                color={focused ? Colors.white : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          title: 'Results',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {focused && (
                <LinearGradient
                  colors={[Colors.accent, '#FF8C42']}
                  style={styles.activeIconBackground}
                />
              )}
              <Ionicons 
                name={focused ? "leaf" : "leaf-outline"} 
                size={24} 
                color={focused ? Colors.white : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {focused && (
                <LinearGradient
                  colors={[Colors.success, '#20C997']}
                  style={styles.activeIconBackground}
                />
              )}
              <Ionicons 
                name={focused ? "library" : "library-outline"} 
                size={24} 
                color={focused ? Colors.white : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {focused && (
                <LinearGradient
                  colors={[Colors.info, '#138496']}
                  style={styles.activeIconBackground}
                />
              )}
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={24} 
                color={focused ? Colors.white : color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabBarGradient: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  activeIconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});