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

  const favoriteTools = Array.from(
    new Map(
      allTools
        .filter(tool => userProfile.favorites?.includes(tool.name.toLowerCase()))
        .map(tool => [tool.name.toLowerCase(), tool]) 
    ).values()
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
            <div key={`favorite-${tool.name}`} className="relative">
              <ToolCard tool={tool} />
              {tool.pricing && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    tool.pricing === 'free' ? 'bg-green-100 text-green-800' :
                    tool.pricing === 'paid' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FavoritesArea;