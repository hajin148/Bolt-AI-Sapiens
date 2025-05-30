import React, { useState } from 'react';
import { Tool } from '../types/Tool';
import { ExternalLink } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="group relative rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 ease-in-out flex flex-col items-center justify-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <a 
        href={tool.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex flex-col items-center w-full h-full"
      >
        <div className="w-12 h-12 mb-3 relative flex items-center justify-center">
          {!imageError ? (
            <img 
              src={tool.iconUrl} 
              alt={`${tool.name} logo`} 
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {tool.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-center text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {tool.name}
        </h3>
        
        <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink size={14} className="text-gray-400" />
        </span>
      </a>
      
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="relative">
            {tool.description}
            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -ml-1 bottom-0 translate-y-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolCard;