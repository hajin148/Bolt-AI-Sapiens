import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
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

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-400"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden">
              {digest.thumbnail ? (
                <img
                  src={digest.thumbnail}
                  alt={digest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-2xl">📺</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {digest.title}
              </h3>
              <span className="ml-2 text-lg flex-shrink-0">
                {getLanguageFlag(digest.lang)}
              </span>
            </div>

            {/* Summary */}
            {digest.summary && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {digest.summary}
              </p>
            )}

            {/* Meta information */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {digest.channel_name && (
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{digest.channel_name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDate(digest.published_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigestCard;