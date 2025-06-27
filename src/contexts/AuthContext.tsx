import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/Tool';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  userTokens: number;
  session: Session | null;
  loading: boolean;
  signup: (email: string, password: string, profile: Omit<UserProfile, 'favorites' | 'isPaid'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (toolId: string) => Promise<void>;
  updateSubscription: (isPaid: boolean) => Promise<void>;
  updateTokens: (newTokens: number) => Promise<void>;
  refreshTokens: () => Promise<void>;
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
  const [userTokens, setUserTokens] = useState<number>(0);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // Start as false since no auto-login

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

  const fetchUserTokens = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_tokens')
        .select('tokens')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user tokens:', error);
        return;
      }

      if (data) {
        setUserTokens(data.tokens);
      }
    } catch (error) {
      console.error('Error fetching user tokens:', error);
    }
  };

  const refreshTokens = async () => {
    if (currentUser) {
      await fetchUserTokens(currentUser.id);
    }
  };

  const updateTokens = async (newTokens: number) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('user_tokens')
        .update({ tokens: newTokens })
        .eq('user_id', currentUser.id);

      if (error) throw error;
      
      setUserTokens(newTokens);
    } catch (error) {
      console.error('Error updating tokens:', error);
      throw error;
    }
  };

  // ❌ REMOVED: Automatic session initialization
  // No useEffect for getSession() - users must explicitly log in

  // Listen for auth state changes (logout events only)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      // Only handle logout events, not automatic logins
      if (event === 'SIGNED_OUT' || !session) {
        setSession(null);
        setCurrentUser(null);
        setUserProfile(null);
        setUserTokens(0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, password: string, profile: Omit<UserProfile, 'favorites' | 'isPaid'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        // ✅ Explicitly set auth state only after successful signup
        setSession(data.session);
        setCurrentUser(data.user);

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

        // Fetch the created profile and tokens
        await fetchUserProfile(data.user.id);
        await fetchUserTokens(data.user.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        // ✅ Explicitly set auth state only after successful login
        setSession(data.session);
        setCurrentUser(data.user);
        await fetchUserProfile(data.user.id);
        await fetchUserTokens(data.user.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear state immediately
      setSession(null);
      setCurrentUser(null);
      setUserProfile(null);
      setUserTokens(0);
    } finally {
      setLoading(false);
    }
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
    userTokens,
    session,
    loading,
    signup,
    login,
    logout,
    toggleFavorite,
    updateSubscription,
    updateTokens,
    refreshTokens,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};