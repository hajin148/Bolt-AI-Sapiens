import React from 'react';
import { VideoDigest } from '../../types/Learning';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Clock, ExternalLink } from 'lucide-react';

interface VideoDigestCardProps {
  digest: VideoDigest;
}

const VideoDigestCard: React.FC<VideoDigestCardProps> = ({ digest }) => {
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : digest.thumbnail || '/placeholder-video.jpg';
  };

  const handleVideoClick = () => {
    window.open(digest.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-red-300"
      onClick={handleVideoClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Thumbnail */}
          <div className="relative w-full h-32 bg-gray-200 rounded-t-lg overflow-hidden">
            <img
              src={getThumbnailUrl(digest.url)}
              alt={digest.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/320x180/f3f4f6/9ca3af?text=Video';
              }}
            />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {digest.duration}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
              {digest.title}
            </h4>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{digest.duration}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-3 w-3" />
                <span>YouTube에서 보기</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoDigestCard;