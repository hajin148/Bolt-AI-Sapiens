import React from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Crown, 
  Settings, 
  X,
  Plus
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  onClose: () => void;
}

export function Sidebar({ isOpen, currentView, onViewChange, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'learning', label: 'Learning Space', icon: BookOpen },
    { id: 'upgrade', label: 'Upgrade to Pro', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="font-semibold text-gray-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Recent Chats */}
          <div className="px-4 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Chats</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate">
                How to learn React...
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate">
                JavaScript best practices
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate">
                Database design tips
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}