import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../lib/firebase';
import { UserProfile } from '../types/Tool';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signup: (email: string, password: string, profile: Omit<UserProfile, 'favorites' | 'isPaid'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (toolId: string) => Promise<void>;
  updateSubscription: (isPaid: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profileRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, profile: Omit<UserProfile, 'favorites' | 'isPaid'>) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(database, `users/${user.uid}`), {
      ...profile,
      favorites: [],
      isPaid: false
    });
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const toggleFavorite = async (toolId: string) => {
    if (!currentUser || !userProfile) return;

    const favorites = userProfile.favorites || [];
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];

    await set(ref(database, `users/${currentUser.uid}/favorites`), newFavorites);
    setUserProfile({ ...userProfile, favorites: newFavorites });
  };

  const updateSubscription = async (isPaid: boolean) => {
    if (!currentUser || !userProfile) return;

    await set(ref(database, `users/${currentUser.uid}/isPaid`), isPaid);
    setUserProfile({ ...userProfile, isPaid });
  };

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    toggleFavorite,
    updateSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};