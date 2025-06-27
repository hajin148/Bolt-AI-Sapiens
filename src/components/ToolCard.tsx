import React, { useState } from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Tool } from '../types/Tool';
import { Card } from './ui/card';

interface ToolCardProps {
  tool: Tool;
  onToolClick?: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onToolClick }) => {
  const [imageError, setImageError] = useState(false);
  const { currentUser, userProfile, toggleFavorite } = useAuth();

  const handleImageError = () => setImageError(true);
  const isFavorite = userProfile?.favorites?.includes(tool.name.toLowerCase());

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await toggleFavorite(tool.name.toLowerCase());
  };

  const handleCardClick = () => {
    if (onToolClick) {
      onToolClick(tool);
    }
  };

  return (
    <Card className="group relative w-[330px] h-[82px] bg-[#3c3c3d] border border-[#545454] rounded-md overflow-hidden hover:border-blue-500/50 hover:bg-[#444] transition-all duration-300 cursor-pointer">
      <div className="relative w-full h-full" onClick={handleCardClick}>
        <div className="relative w-full h-full">
          {/* 좌측 아이콘 */}
          <div className="absolute top-3 left-3 w-7 h-7 bg-[#121212] rounded-md flex items-center justify-center overflow-hidden">
            {!imageError ? (
              <img
                src={tool.iconUrl}
                alt={`${tool.name} logo`}
                className="w-full h-full object-contain"
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <span className="text-xs text-white">{tool.name.charAt(0)}</span>
            )}
          </div>

          {/* 툴 이름 */}
          <div className="absolute top-3.5 left-12 font-medium text-white text-sm whitespace-nowrap group-hover:text-blue-400 transition-colors duration-300">
            {tool.name}
          </div>

          {/* 설명 (말줄임 처리) */}
          <div className="absolute top-[46px] left-3 right-3 font-normal text-white text-xs opacity-80 overflow-hidden whitespace-nowrap text-ellipsis">
            {tool.description}
          </div>
        </div>
      </div>

    </Card>
  );
};

export default ToolCard;
