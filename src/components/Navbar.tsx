import React from 'react';
import { Menu, User, Crown } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface NavbarProps {
  user: SupabaseUser | null;
  onAuthClick: () => void;
  onMenuClick: () => void;
  currentView: string;
}

export function Navbar({ user, onAuthClick, onMenuClick, currentView }: NavbarProps) {
  const showUpgradeButton = !user || currentView === 'upgrade';

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-gray-900">AI Sapiens</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showUpgradeButton && (
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>Upgrade to Pro</span>
            </button>
          )}
          
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700">{user.email}</span>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}