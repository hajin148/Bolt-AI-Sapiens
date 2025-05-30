import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tool } from '../types/Tool';
import ToolCard from './ToolCard';
import { Heart } from 'lucide-react';

interface FavoritesAreaProps {
  allTools: Tool[];
}

const FavoritesArea: React.FC<FavoritesAreaProps> = ({ allTools }) => {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser || !userProfile) return null;

  const favoriteTools = allTools.filter(tool => 
    userProfile.favorites?.includes(tool.name.toLowerCase())
  );

  if (favoriteTools.length === 0) {
    return (
      <section className="py-8 bg-blue-50 rounded-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <Heart className="mx-auto h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600">
              Click the heart icon on any AI tool card to add it to your favorites
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-blue-50 rounded-lg mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Heart className="mr-2 h-5 w-5 text-blue-500" />
            Your Favorites
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quick access to your favorite AI tools
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favoriteTools.map((tool) => (
            <ToolCard key={`favorite-${tool.name}`} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FavoritesArea;