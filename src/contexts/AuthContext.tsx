import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/Tool';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  signup: (email: string, password: string, profile: Omit<UserProfile, 'id' | 'user_id' | 'favorites' | 'is_paid' | 'created_at' | 'updated_at'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (toolId: string) => Promise<void>;
  updateSubscription: (isPaid: boolean) => Promise<void>;
  loading: boolean;
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
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setCurrentUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found, fetching profile...');
            await fetchUserProfile(session.user.id);
          } else {
            console.log('No user session found');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (!mounted) return;

      setSession(session);
      setCurrentUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('User authenticated, fetching profile...');
        await fetchUserProfile(session.user.id);
      } else {
        console.log('User logged out, clearing profile...');
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      console.log('User profile fetched:', data);
      setUserProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, profile: Omit<UserProfile, 'id' | 'user_id' | 'favorites' | 'is_paid' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Starting signup process for:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data);

      if (data.user) {
        console.log('Creating user profile...');
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            username: profile.username,
            email: profile.email,
            phone: profile.phone || null,
            job: profile.job,
            interests: profile.interests || [],
            favorites: [],
            is_paid: false,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        console.log('User profile created successfully');
      }
    } catch (error) {
      console.error('Signup process failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data);
    } catch (error) {
      console.error('Login process failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting to logout...');
      
      // Clear local state immediately
      setCurrentUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Failed to log out:', error);
      // Re-throw the error so the UI can handle it
      throw error;
    }
  };

  const toggleFavorite = async (toolId: string) => {
    if (!currentUser || !userProfile) return;

    try {
      const favorites = userProfile.favorites || [];
      const newFavorites = favorites.includes(toolId)
        ? favorites.filter(id => id !== toolId)
        : [...favorites, toolId];

      const { error } = await supabase
        .from('user_profiles')
        .update({ favorites: newFavorites })
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setUserProfile({ ...userProfile, favorites: newFavorites });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const updateSubscription = async (isPaid: boolean) => {
    if (!currentUser || !userProfile) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_paid: isPaid })
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setUserProfile({ ...userProfile, is_paid: isPaid });
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const value = {
    currentUser,
    session,
    userProfile,
    signup,
    login,
    logout,
    toggleFavorite,
    updateSubscription,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};