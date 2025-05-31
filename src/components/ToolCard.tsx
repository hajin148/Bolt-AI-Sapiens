import React, { useState } from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Tool } from '../types/Tool';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hovercard';

interface ToolCardProps {
  tool: Tool;
  dialogOpen?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, dialogOpen = false }) => {
  const [imageError, setImageError] = useState(false);
  const { currentUser, userProfile, toggleFavorite } = useAuth();

  const handleImageError = () => setImageError(true);
  const isFavorite = userProfile?.favorites?.includes(tool.name.toLowerCase());
  const categoryName = tool.category.split('-')[0];

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await toggleFavorite(tool.name.toLowerCase());
  };

  const getPricingBadge = () => {
    switch (tool.pricing) {
      case 'free':
        return <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-medium rounded-full z-[1]">Free</span>;
      case 'paid':
        return <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-medium rounded-full z-[1]">Paid</span>;
      case 'freemium':
        return <span className="absolute top-2 left-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-medium rounded-full z-[1]">Freemium</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="group relative z-0 p-4 hover:border-blue-400 min-w-[165px] max-w-[180px]">

      {getPricingBadge()}
      {!dialogOpen ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-2 relative flex items-center justify-center">
                  {!imageError ? (
                    <img
                      src={tool.iconUrl}
                      alt={`${tool.name} logo`}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-medium">
                      {tool.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-center text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                  {tool.name}
                </h3>
                <span className="text-xs text-gray-500 mt-1 hidden md:block">{categoryName}</span>
              </div>
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{tool.name}</h4>
                {tool.pricing && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    tool.pricing === 'free' ? 'bg-green-100 text-green-800' :
                    tool.pricing === 'paid' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{tool.description}</p>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Use Tool
                    <ExternalLink size={14} className="ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-2 relative flex items-center justify-center">
              {!imageError ? (
                <img
                  src={tool.iconUrl}
                  alt={`${tool.name} logo`}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-medium">
                  {tool.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-center text-gray-800 line-clamp-1">
              {tool.name}
            </h3>
            <span className="text-xs text-gray-500 mt-1 hidden md:block">{categoryName}</span>
          </div>
        </a>
      )}

      {currentUser && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-all duration-200 z-[1]"
        >
          <Heart
            size={14}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      )}
    </Card>
  );
};

export default ToolCard;
