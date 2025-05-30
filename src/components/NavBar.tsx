import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import PricingModal from './PricingModal';
import { Button } from './ui/button';

const NavBar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { currentUser, userProfile, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <nav className={`${isSticky ? 'sticky top-0 z-10 bg-white/95 shadow-md backdrop-blur-sm py-2' : 'py-4'} transition-all duration-300 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Sapiens
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {!userProfile?.isPaid && (
                  <Button
                    onClick={() => setShowPricingModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  >
                    Upgrade to Pro
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => openAuthModal('login')}
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Login
                </Button>
                <Button
                  onClick={() => openAuthModal('signup')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </nav>
  );
};

export default NavBar;