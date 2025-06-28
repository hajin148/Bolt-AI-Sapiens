import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { BellIcon, GlobeIcon, UserIcon, Menu, X, LogOut, LogIn, UserPlus } from 'lucide-react';

interface NavBarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onUpgradeClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onSignupClick, onUpgradeClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hasNewContent, setHasNewContent] = useState(true); // TODO: Connect to actual news update logic
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

  const handleUserIconClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleDropdownItemClick = (action: () => void) => {
    setShowUserDropdown(false);
    action();
  };

  const handleGlobeClick = () => {
    navigate('/news');
    if (hasNewContent) {
      setHasNewContent(false); // Mark as read when user visits news
    }
  };
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
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`w-7 h-7 p-0 hover:bg-[#333333] ${
                    isNewsPage ? 'bg-[#333333]' : ''
                  }`}
                  onClick={handleGlobeClick}
                >
                  <GlobeIcon className={`w-7 h-7 ${
                    isNewsPage ? 'text-blue-400' : 'text-white'
                  }`} />
                </Button>
                {/* Red notification dot for new content */}
                {hasNewContent && currentUser && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#202020]" />
                )}
              </div>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-7 h-7 p-0 hover:bg-[#333333]"
                  onClick={handleUserIconClick}
                >
                  <UserIcon className="w-7 h-7 text-white" />
                </Button>
                
                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserDropdown(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => handleDropdownItemClick(handleLogout)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`w-7 h-7 p-0 hover:bg-[#333333] ${
                    isNewsPage ? 'bg-[#333333]' : ''
                  }`}
                  onClick={handleGlobeClick}
                >
                  <GlobeIcon className={`w-7 h-7 ${
                    isNewsPage ? 'text-blue-400' : 'text-white'
                  }`} />
                </Button>
              </div>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-7 h-7 p-0 hover:bg-[#333333]"
                  onClick={handleUserIconClick}
                >
                  <UserIcon className="w-7 h-7 text-white" />
                </Button>
                
                {/* User Dropdown Menu for non-logged in users */}
                {showUserDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserDropdown(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => handleDropdownItemClick(onLoginClick)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                        disabled={loading}
                      >
                        <LogIn className="h-4 w-4" />
                        Log in
                      </button>
                      <button
                        onClick={() => handleDropdownItemClick(onSignupClick)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                        disabled={loading}
                      >
                        <UserPlus className="h-4 w-4" />
                        Register
                      </button>
                    </div>
                  </>
                )}
              </div>
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
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center gap-2"
                    disabled={loading}
                  >
                    <LogIn className="h-4 w-4" />
                    로그인
                  </button>
                  <button
                    onClick={() => {
                      onSignupClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center gap-2"
                    disabled={loading}
                  >
                    <UserPlus className="h-4 w-4" />
                    회원가입
                  </button>
                </div>
              )}
              
              {/* Upgrade button for mobile */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;