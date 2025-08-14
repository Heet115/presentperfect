import { db, COLLECTIONS } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SavedGiftIdea {
  id?: string;
  userId: string;
  giftIdea: string;
  recipientInfo?: string;
  savedAt: Timestamp;
}

export interface RecipientProfile {
  id?: string;
  userId: string;
  name: string;
  age: string;
  gender: string;
  interests: string[];
  personality: string;
  relationship: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Profile Functions
export const createUserProfile = async (user: User): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USER_PROFILES, user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (userId: string, updates: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
  await setDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

// Saved Gift Ideas Functions
export const saveGiftIdea = async (userId: string, giftIdea: string, recipientInfo?: string): Promise<string> => {
  const savedGiftRef = collection(db, COLLECTIONS.GIFT_SUGGESTIONS);
  const docRef = await addDoc(savedGiftRef, {
    userId,
    giftIdea,
    recipientInfo: recipientInfo || '',
    savedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getSavedGiftIdeas = async (userId: string): Promise<SavedGiftIdea[]> => {
  const q = query(
    collection(db, COLLECTIONS.GIFT_SUGGESTIONS),
    where('userId', '==', userId)
    // Temporarily removed orderBy to avoid index requirement
    // orderBy('savedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SavedGiftIdea[];
  
  // Sort in JavaScript instead (less efficient but works without index)
  return results.sort((a, b) => {
    const aTime = a.savedAt?.toMillis?.() || 0;
    const bTime = b.savedAt?.toMillis?.() || 0;
    return bTime - aTime; // Descending order (newest first)
  });
};

export const deleteSavedGiftIdea = async (giftId: string): Promise<void> => {
  const giftRef = doc(db, COLLECTIONS.GIFT_SUGGESTIONS, giftId);
  await deleteDoc(giftRef);
};

// Recipient Profile Functions
export const saveRecipientProfile = async (userId: string, profile: Omit<RecipientProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const recipientRef = collection(db, COLLECTIONS.RECIPIENT_PROFILES);
  const docRef = await addDoc(recipientRef, {
    userId,
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getRecipientProfiles = async (userId: string): Promise<RecipientProfile[]> => {
  const q = query(
    collection(db, COLLECTIONS.RECIPIENT_PROFILES),
    where('userId', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as RecipientProfile[];
  
  return results.sort((a, b) => {
    const aTime = a.updatedAt?.toMillis?.() || 0;
    const bTime = b.updatedAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
};

export const updateRecipientProfile = async (profileId: string, updates: Partial<Omit<RecipientProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const profileRef = doc(db, COLLECTIONS.RECIPIENT_PROFILES, profileId);
  await setDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const deleteRecipientProfile = async (profileId: string): Promise<void> => {
  const profileRef = doc(db, COLLECTIONS.RECIPIENT_PROFILES, profileId);
  await deleteDoc(profileRef);
};