import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

interface NavBarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onUpgradeClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onSignupClick, onUpgradeClick }) => {
  const [isSticky, setIsSticky] = useState(false);
  const { currentUser, userProfile, logout, loading } = useAuth();

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

  return (
    <nav className={`${isSticky ? 'sticky top-0 z-10 bg-white/95 shadow-md backdrop-blur-sm py-2' : 'py-4'} transition-all duration-300 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">AI Sapiens</h1>
          </div>
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 text-sm">Loading...</span>
              </div>
            ) : currentUser ? (
              <div className="flex items-center space-x-4">
                {!userProfile?.isPaid && (
                  <Button
                    onClick={onUpgradeClick}
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
                  onClick={onLoginClick}
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Login
                </Button>
                <Button
                  onClick={onSignupClick}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;