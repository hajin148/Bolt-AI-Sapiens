import React from 'react';
import { VideoDigest } from '../../types/Learning';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Clock, ExternalLink, Calendar, User } from 'lucide-react';

interface VideoDigestCardProps {
  digest: VideoDigest;
}

const VideoDigestCard: React.FC<VideoDigestCardProps> = ({ digest }) => {
  // Handle both old simple URL format and new enhanced format
  const getVideoUrl = () => {
    if (digest.url) {
      return digest.url;
    }
    if (digest.video_id) {
      return `https://www.youtube.com/watch?v=${digest.video_id}`;
    }
    return '#';
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : digest.video_id || null;
  };

  const getThumbnailUrl = () => {
    if (digest.thumbnail) {
      return digest.thumbnail;
    }
    const videoId = getYouTubeVideoId(getVideoUrl());
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : '/placeholder-video.jpg';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleVideoClick = () => {
    const url = getVideoUrl();
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-red-500/50 overflow-hidden bg-gray-800/50 border-gray-700"
      onClick={handleVideoClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Thumbnail */}
          <div className="relative w-full h-40 bg-gray-700 overflow-hidden">
            <img
              src={getThumbnailUrl()}
              alt={digest.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/320x180/374151/9ca3af?text=Video';
              }}
            />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Duration badge */}
            {digest.duration && (
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-90 text-white text-sm px-3 py-1 rounded-md font-medium">
                {digest.duration}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-3 leading-snug">
              {digest.title}
            </h4>
            
            {/* Summary if available */}
            {digest.summary && (
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {digest.summary}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-3">
                {digest.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{digest.duration}</span>
                  </div>
                )}
                {digest.youtube_channels?.name && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="truncate max-w-24">{digest.youtube_channels.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {digest.published_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{formatDate(digest.published_at)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-4 w-4" />
                  <span>Watch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoDigestCard;