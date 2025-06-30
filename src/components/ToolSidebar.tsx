import React from 'react';
import { X, ExternalLink, Heart, Star, Users, Calendar } from 'lucide-react';
import { Tool } from '../types/Tool';
import { tools } from '../data/tools';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ToolSidebarProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

const ToolSidebar: React.FC<ToolSidebarProps> = ({ tool, isOpen, onClose }) => {
  const { currentUser, userProfile, toggleFavorite } = useAuth();

  if (!tool) return null;

  const isFavorite = userProfile?.favorites?.includes(tool.name.toLowerCase());

  const handleFavoriteClick = async () => {
    if (!currentUser) return;
    await toggleFavorite(tool.name.toLowerCase());
  };

  const handleVisitWebsite = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const getSimilarTools = () => {
    // Get tools from the same category, excluding the current tool
    const similarTools = tools
      .filter(t => t.category === tool.category && t.name !== tool.name)
      .slice(0, 3);
    
    // If we don't have enough from the same category, add some popular tools
    if (similarTools.length < 3) {
      const popularTools = tools
        .filter(t => ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Cursor', 'V0'].includes(t.name) && t.name !== tool.name)
        .slice(0, 3 - similarTools.length);
      
      similarTools.push(...popularTools);
    }
    
    return similarTools.slice(0, 3);
  };

  const handleSimilarToolClick = (similarTool: Tool) => {
    window.open(similarTool.url, '_blank', 'noopener,noreferrer');
  };
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-700';
      case 'paid': return 'bg-red-100 text-red-700';
      case 'freemium': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'Free';
      case 'paid': return 'Paid';
      case 'freemium': return 'Freemium';
      default: return 'Unknown';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-[72px] right-0 h-[calc(100vh-72px)] w-96 bg-[#121212] border-l border-[#333333] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-8">
            {/* Tool Icon and Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#333333] rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={tool.iconUrl}
                  alt={`${tool.name} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-[#444444] items-center justify-center text-gray-300 text-lg font-bold hidden">
                  {tool.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">{tool.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getPricingColor(tool.pricing || 'unknown')}>
                    {getPricingText(tool.pricing || 'unknown')}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
              <div className="flex items-start gap-3">
                <p className="text-gray-300 leading-relaxed flex-1">{tool.description}</p>
                {currentUser && (
                  <button
                    onClick={handleFavoriteClick}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite 
                        ? 'text-red-500 hover:bg-red-500/10' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
              
              {/* Visit Website Button - moved here */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleVisitWebsite}
                  className="w-[286px] h-[36px] bg-[#7218F9] text-white font-medium hover:bg-[#5a13c7] transition-colors text-center flex items-center justify-center rounded-md"
                >
                  Visit Website
                </button>
              </div>

            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  AI-powered automation
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Easy integration
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Real-time collaboration
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Advanced analytics
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#333333] p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Users</span>
                  </div>
                  <p className="text-lg font-semibold text-white">1.2M+</p>
                </div>
                <div className="bg-[#333333] p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Founded</span>
                  </div>
                  <p className="text-lg font-semibold text-white">2021</p>
                </div>
              </div>
            </div>

            {/* Similar Tools */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Similar Tools</h4>
              <div className="space-y-2">
                {getSimilarTools().map((similarTool) => (
                  <div 
                    key={similarTool.name} 
                    className="flex items-center gap-3 p-2 hover:bg-[#333333] rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleSimilarToolClick(similarTool)}
                  >
                    <div className="w-8 h-8 bg-[#444444] rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={similarTool.iconUrl}
                        alt={`${similarTool.name} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-[#555555] items-center justify-center text-gray-300 text-xs font-bold hidden">
                        {similarTool.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white">{similarTool.name}</span>
                      <p className="text-xs text-gray-400 line-clamp-1">{similarTool.description}</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ToolSidebar;