import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  plantsIdentified: number;
  daysActive: number;
  achievements: string[];
  streak: number;
  joinedAt: any;
  lastActive: any;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

// Generate profile picture URL using UI Avatars (PNG format, better for React Native)
export function generateProfilePicture(name: string): string {
  const cleanName = (name || 'User').trim();
  const initials = cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', 'FFB347', '87CEEB'];
  const bgColor = colors[cleanName.length % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=200&font-size=0.6&bold=true`;
}

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Generate profile picture
    const photoURL = generateProfilePicture(displayName);
    
    // Update auth profile
    await updateProfile(user, { displayName, photoURL });
    
    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL,
      bio: '🌱 Plant enthusiast & nature lover',
      plantsIdentified: 0,
      daysActive: 1,
      achievements: [],
      streak: 0,
      joinedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      }
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last active
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastActive: serverTimestamp()
    });
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const profile = docSnap.data() as UserProfile;
      // Ensure profile has a photo URL
      if (!profile.photoURL) {
        profile.photoURL = generateProfilePicture(profile.displayName || profile.email);
        // Update the profile with the generated photo URL
        try {
          await updateDoc(docRef, { photoURL: profile.photoURL });
        } catch (updateError) {
          console.log('Could not update profile photo URL:', updateError);
        }
      }
      return profile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    // If displayName is being updated, also update photoURL
    if (updates.displayName && !updates.photoURL) {
      updates.photoURL = generateProfilePicture(updates.displayName);
    }
    
    // Ensure photoURL is always present
    if (!updates.photoURL && updates.displayName) {
      updates.photoURL = generateProfilePicture(updates.displayName);
    }
    
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      lastActive: serverTimestamp()
    });
    
    // Also update Firebase Auth profile if displayName or photoURL changed
    if (auth.currentUser && (updates.displayName || updates.photoURL)) {
      await updateProfile(auth.currentUser, {
        displayName: updates.displayName || auth.currentUser.displayName,
        photoURL: updates.photoURL || auth.currentUser.photoURL
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const incrementPlantCount = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const currentCount = userDoc.data().plantsIdentified || 0;
      await updateDoc(doc(db, 'users', uid), {
        plantsIdentified: currentCount + 1,
        lastActive: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error incrementing plant count:', error);
  }
};

// Create or get guest user profile


export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};