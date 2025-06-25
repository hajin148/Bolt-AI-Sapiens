import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface NavBarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onUpgradeClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onSignupClick, onUpgradeClick }) => {
  const [isSticky, setIsSticky] = useState(false);
  const { currentUser, userProfile, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const isNewsPage = location.pathname.startsWith('/news');
  const isLearningPage = location.pathname.startsWith('/learning') || location.pathname.startsWith('/classroom');
  const isPromptPage = location.pathname.startsWith('/prompts');

  return (
    <nav className={`${isSticky ? 'sticky top-0 z-10 bg-white/95 shadow-md backdrop-blur-sm py-2' : 'py-4'} transition-all duration-300 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                AI Sapiens
              </button>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors ${
                  !isNewsPage && !isLearningPage && !isPromptPage
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                AI Tools
              </button>
              <button
                onClick={() => navigate('/news')}
                className={`text-sm font-medium transition-colors ${
                  isNewsPage 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                AI News
              </button>
              {currentUser && (
                <>
                  <button
                    onClick={() => navigate('/learning')}
                    className={`text-sm font-medium transition-colors ${
                      isLearningPage 
                        ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Learning Space
                  </button>
                  <button
                    onClick={() => navigate('/prompts')}
                    className={`text-sm font-medium transition-colors ${
                      isPromptPage 
                        ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    AI Prompts
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : currentUser ? (
              <div className="flex items-center space-x-4">
                {userProfile && !userProfile.isPaid && (
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

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className={`text-sm font-medium transition-colors ${
              !isNewsPage && !isLearningPage && !isPromptPage
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            AI Tools
          </button>
          <button
            onClick={() => navigate('/news')}
            className={`text-sm font-medium transition-colors ${
              isNewsPage 
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            AI News
          </button>
          {currentUser && (
            <>
              <button
                onClick={() => navigate('/learning')}
                className={`text-sm font-medium transition-colors ${
                  isLearningPage 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Learning
              </button>
              <button
                onClick={() => navigate('/prompts')}
                className={`text-sm font-medium transition-colors ${
                  isPromptPage 
                    ? 'text-purple-600 border-b-2 border-purple-600 pb-1' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Prompts
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;