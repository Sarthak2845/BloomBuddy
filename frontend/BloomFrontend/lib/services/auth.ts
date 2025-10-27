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

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update auth profile
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
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
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      lastActive: serverTimestamp()
    });
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

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};