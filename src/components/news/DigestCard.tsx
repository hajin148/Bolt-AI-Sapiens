import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ExternalLink, Play } from 'lucide-react';
import { DigestCardData } from '../../types/News';

interface DigestCardProps {
  digest: DigestCardData;
}

const DigestCard: React.FC<DigestCardProps> = ({ digest }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/news/${digest.video_id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLanguageFlag = (lang: string) => {
    const flags = {
      'en': '🇺🇸',
      'ko': '🇰🇷',
      'es': '🇪🇸',
      'ja': '🇯🇵',
      'zh': '🇨🇳',
      'others': '🌐'
    };
    return flags[lang as keyof typeof flags] || '🌐';
  };

  const getLanguageColor = (lang: string) => {
    const colors = {
      'en': 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      'ko': 'bg-red-600/20 text-red-400 border-red-500/30',
      'es': 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
      'ja': 'bg-pink-600/20 text-pink-400 border-pink-500/30',
      'zh': 'bg-red-600/20 text-red-400 border-red-500/30',
      'others': 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    };
    return colors[lang as keyof typeof colors] || 'bg-gray-600/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div 
      className="group cursor-pointer hover:bg-gray-800/30 transition-all duration-300 rounded-lg p-4 -m-4 max-w-2xl"
      onClick={handleClick}
    >
      <div className="flex gap-4">
        {/* Thumbnail Section - Fixed size matching Figma */}
        <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 relative">
            {digest.thumbnail ? (
              <img
                src={digest.thumbnail}
                alt={digest.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/192x128/374151/9ca3af?text=AI+News';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl opacity-20">🤖</div>
              </div>
            )}
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <Play className="h-5 w-5 text-gray-800 ml-0.5" fill="currentColor" />
              </div>
            </div>

            {/* Language Badge */}
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getLanguageColor(digest.lang)}`}>
                {getLanguageFlag(digest.lang)}
                {digest.lang.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Title and Summary */}
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-2 leading-tight">
              {digest.title}
            </h3>

            {digest.summary && (
              <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
                {digest.summary}
              </p>
            )}
          </div>

          {/* Meta Information - Matching Figma layout */}
          <div className="space-y-2">
            {/* YouTuber Name */}
            {digest.channel_name && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <User className="h-3.5 w-3.5" />
                <span className="font-medium">{digest.channel_name}</span>
              </div>
            )}
            
            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(digest.published_at)}</span>
            </div>
            
            {/* Read more indicator */}
            <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-1">
              <span className="font-medium">Read article</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigestCard;