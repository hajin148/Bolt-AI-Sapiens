import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { BellIcon, GlobeIcon, UserIcon, Menu, X } from 'lucide-react';

interface NavBarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onUpgradeClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onSignupClick, onUpgradeClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-[#202020] fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 h-[72px] flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="AI Sapiens Logo"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
              onError={({ currentTarget }) => {
                currentTarget.style.display = 'none';
                const fallback = currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div 
              className="hidden text-white text-lg font-bold cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              AI Sapiens
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div className="flex items-center gap-4">
          {/* AI News - always visible */}
          <button
            onClick={() => navigate('/news')}
            className={`hidden md:block text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] transition-colors ${
              isNewsPage 
                ? 'text-blue-400' 
                : 'text-white hover:text-blue-400'
            }`}
          >
            AI News
          </button>

          {/* AI Prompts - only when logged in */}
          {currentUser && (
            <button
              onClick={() => navigate('/prompts')}
              className={`hidden md:block text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] transition-colors ${
                isPromptPage 
                  ? 'text-purple-400' 
                  : 'text-white hover:text-purple-400'
              }`}
            >
              AI Prompts
            </button>
          )}

          {/* Learn Space button - only when logged in */}
          {currentUser && (
            <Button
              onClick={() => navigate('/learning')}
              variant="outline"
              className="hidden md:block h-[42px] bg-[#111111] rounded-md border-none text-white text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] px-3"
            >
              Learn Space
            </Button>
          )}

          {/* Action icons and auth */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="w-7 h-7 p-0 hover:bg-[#333333]">
                <BellIcon className="w-7 h-7 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 p-0 hover:bg-[#333333]">
                <GlobeIcon className="w-7 h-7 text-white" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-7 h-7 p-0 hover:bg-[#333333]"
                onClick={handleLogout}
              >
                <UserIcon className="w-7 h-7 text-white" />
              </Button>
              {userProfile && !userProfile.isPaid && (
                <Button
                  onClick={onUpgradeClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0 text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] px-3"
                >
                  Upgrade to Pro
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={onLoginClick}
                variant="ghost"
                className="text-white hover:text-blue-400 hover:bg-[#333333] text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px]"
                disabled={loading}
              >
                Login
              </Button>
              <Button
                onClick={onSignupClick}
                className="bg-blue-600 text-white hover:bg-blue-700 border-0 text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] px-3"
                disabled={loading}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-blue-400 p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-[72px] left-0 right-0 bg-[#202020] border-t border-gray-700 md:hidden">
            <div className="flex flex-col p-3 space-y-3">
              <button
                onClick={() => {
                  navigate('/news');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] transition-colors ${
                  isNewsPage 
                    ? 'text-blue-400' 
                    : 'text-white hover:text-blue-400'
                }`}
              >
                AI News
              </button>
              {currentUser && (
                <>
                  <button
                    onClick={() => {
                      navigate('/learning');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] transition-colors ${
                      isLearningPage 
                        ? 'text-blue-400' 
                        : 'text-white hover:text-blue-400'
                    }`}
                  >
                    Learning Space
                  </button>
                  <button
                    onClick={() => {
                      navigate('/prompts');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px] transition-colors ${
                      isPromptPage 
                        ? 'text-purple-400' 
                        : 'text-white hover:text-purple-400'
                    }`}
                  >
                    AI Prompts
                  </button>
                </>
              )}
              
              {/* Mobile auth buttons */}
              {currentUser ? (
                <div className="pt-3 border-t border-gray-700">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-7 h-7 p-0 hover:bg-[#333333]"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <UserIcon className="w-7 h-7 text-white" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      onLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-white hover:text-blue-400 hover:bg-[#333333] text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px]"
                    disabled={loading}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      onSignupClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 border-0 text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px]"
                    disabled={loading}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
              
              {/* Upgrade button for mobile */}
              {currentUser && userProfile && !userProfile.isPaid && (
                <div className="pt-3 border-t border-gray-700">
                  <Button
                    onClick={() => {
                      onUpgradeClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0 text-sm font-normal font-['Pretendard-Regular',Helvetica] tracking-[-0.21px]"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;