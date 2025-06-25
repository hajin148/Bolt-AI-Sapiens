import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/Tool';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile({
          username: data.username,
          email: data.email,
          phone: data.phone || '',
          job: data.job,
          interests: data.interests || [],
          favorites: data.favorites || [],
          isPaid: data.is_paid || false,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes across all tabs
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setCurrentUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      
      // Ensure loading is false after auth state change
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fallback: If we have a user but no profile, try to fetch it
  useEffect(() => {
    if (currentUser && !userProfile && !loading) {
      console.log('User exists but profile missing, fetching profile...');
      fetchUserProfile(currentUser.id);
    }
  }, [currentUser, userProfile, loading]);

  const signup = async (email: string, password: string, profile: Omit<UserProfile, 'favorites' | 'isPaid'>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
          job: profile.job,
          interests: profile.interests,
          favorites: [],
          is_paid: false,
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const toggleFavorite = async (toolId: string) => {
    if (!currentUser || !userProfile) return;

    const favorites = userProfile.favorites || [];
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];

    const { error } = await supabase
      .from('user_profiles')
      .update({ favorites: newFavorites })
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }

    setUserProfile({ ...userProfile, favorites: newFavorites });
  };

  const updateSubscription = async (isPaid: boolean) => {
    if (!currentUser || !userProfile) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ is_paid: isPaid })
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    setUserProfile({ ...userProfile, isPaid });
  };

  const value = {
    currentUser,
    userProfile,
    session,
    loading,
    signup,
    login,
    logout,
    toggleFavorite,
    updateSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};