import React from 'react';
import { User } from '@supabase/supabase-js';
import { ChatView } from './ChatView';
import { LearningSpaceView } from './LearningSpaceView';
import { UpgradeView } from './UpgradeView';
import { SettingsView } from './SettingsView';

interface MainContentProps {
  currentView: string;
  user: User | null;
  sidebarOpen: boolean;
}

export function MainContent({ currentView, user, sidebarOpen }: MainContentProps) {
  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatView user={user} />;
      case 'learning':
        return <LearningSpaceView user={user} />;
      case 'upgrade':
        return <UpgradeView user={user} />;
      case 'settings':
        return <SettingsView user={user} />;
      default:
        return <ChatView user={user} />;
    }
  };

  return (
    <main className={`
      flex-1 transition-all duration-300 ease-in-out
      ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
    `}>
      {renderView()}
    </main>
  );
}