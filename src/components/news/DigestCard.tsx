import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ExternalLink, Play } from 'lucide-react';
import { DigestCardData } from '../../types/News';

interface DigestCardProps {
  digest: DigestCardData;
}

// Function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

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

  // Decode HTML entities in title and summary
  const decodedTitle = decodeHtmlEntities(digest.title);
  const decodedSummary = digest.summary ? decodeHtmlEntities(digest.summary) : null;

  return (
    <div 
      className="group cursor-pointer hover:bg-gray-800/30 transition-all duration-300 rounded-lg p-4 max-w-2xl"
      onClick={handleClick}
    >
      <div className="flex gap-4">
        {/* Thumbnail Section - Matching Figma proportions */}
        <div className="relative w-40 h-24 flex-shrink-0 overflow-hidden rounded-lg">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 relative">
            {digest.thumbnail ? (
              <img
                src={digest.thumbnail}
                alt={decodedTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/160x96/374151/9ca3af?text=AI+News';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-3xl opacity-20">🤖</div>
              </div>
            )}
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <Play className="h-4 w-4 text-gray-800 ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Matching Figma layout */}
        <div className="flex-1 flex flex-col">
          {/* Date - Prominent at top like Figma */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <Calendar className="h-3 w-3" />
            <span className="font-medium">{formatDate(digest.published_at)}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-2 leading-tight">
            {decodedTitle}
          </h3>

          {/* Summary */}
          {decodedSummary && (
            <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed flex-1">
              {decodedSummary}
            </p>
          )}

          {/* Bottom section with YouTuber name and read more */}
          <div className="flex items-center justify-between">
            {/* YouTuber Name - Prominent like Figma */}
            {digest.channel_name && (
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <User className="h-3 w-3" />
                <span className="font-medium">{digest.channel_name}</span>
              </div>
            )}
            
            {/* Read more indicator */}
            <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="font-medium">Read</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigestCard;