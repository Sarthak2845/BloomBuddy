import React, { createContext, useContext, useState, useEffect } from 'react';
import { LightTheme, DarkTheme } from '../constants/Colors';
import { getAuth } from 'firebase/auth';
import { getUserProfile, updateUserProfile } from '../lib/services/auth';

type Theme = typeof LightTheme;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<Theme>(LightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    setTheme(isDark ? DarkTheme : LightTheme);
  }, [isDark]);

  const loadThemePreference = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        const profile = await getUserProfile(auth.currentUser.uid);
        if (profile?.preferences?.darkMode) {
          setIsDark(profile.preferences.darkMode);
        }
      }
    } catch (error) {
      console.log('Could not load theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await updateUserProfile(auth.currentUser.uid, {
          preferences: {
            darkMode: newIsDark,
            notifications: true,
            language: 'en'
          }
        });
      }
    } catch (error) {
      console.log('Could not save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};