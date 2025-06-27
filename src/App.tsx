import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { AuthModal } from './components/AuthModal';
import { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          user={user}
          onAuthClick={() => setShowAuthModal(true)}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          currentView={currentView}
        />
        
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen}
            currentView={currentView}
            onViewChange={setCurrentView}
            onClose={() => setSidebarOpen(false)}
          />
          
          <MainContent 
            currentView={currentView}
            user={user}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;