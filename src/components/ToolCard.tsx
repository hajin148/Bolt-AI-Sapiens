import React, { useState } from 'react';
import { Tool } from '../types/Tool';
import { ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hovercard';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [imageError, setImageError] = useState(false);
  const { currentUser, userProfile, toggleFavorite } = useAuth();
  
  const handleImageError = () => {
    setImageError(true);
  };

  const isFavorite = userProfile?.favorites?.includes(tool.name.toLowerCase());

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      return;
    }
    await toggleFavorite(tool.name.toLowerCase());
  };

  return (
    <Card className="group relative h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative flex items-center justify-center">
              {!imageError ? (
                <img 
                  src={tool.iconUrl} 
                  alt={`${tool.name} logo`} 
                  className="w-full h-full object-contain rounded-md transition-transform duration-300 group-hover:scale-110"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-lg font-medium">
                  {tool.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <a 
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors duration-200 flex items-center"
                    >
                      {tool.name}
                      <ExternalLink size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{tool.name}</h4>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </div>
          </div>
          {currentUser && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFavoriteClick}
            >
              <Heart
                size={16}
                className={`${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="text-xs">
          {tool.category}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          asChild
        >
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            Use Tool
            <ExternalLink size={14} className="ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;