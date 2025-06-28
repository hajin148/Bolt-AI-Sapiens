import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
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
      'en': 'bg-blue-100 text-blue-700',
      'ko': 'bg-red-100 text-red-700',
      'es': 'bg-yellow-100 text-yellow-700',
      'ja': 'bg-pink-100 text-pink-700',
      'zh': 'bg-red-100 text-red-700',
      'others': 'bg-gray-100 text-gray-700'
    };
    return colors[lang as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg overflow-hidden bg-white max-w-2xl"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Thumbnail Section - Fixed size matching Figma */}
          <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 relative">
              {digest.thumbnail ? (
                <img
                  src={digest.thumbnail}
                  alt={digest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/192x128/f3f4f6/9ca3af?text=AI+News';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-4xl opacity-20">🤖</div>
                </div>
              )}
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <Play className="h-5 w-5 text-gray-800 ml-0.5" fill="currentColor" />
                </div>
              </div>

              {/* Language Badge */}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(digest.lang)}`}>
                  {getLanguageFlag(digest.lang)}
                  {digest.lang.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* Title and Summary */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2 leading-tight">
                {digest.title}
              </h3>

              {digest.summary && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                  {digest.summary}
                </p>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {digest.channel_name && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="font-medium truncate max-w-20">{digest.channel_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(digest.published_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="font-medium">Read more</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigestCard;