import React from 'react';
import { VideoDigest } from '../../types/Learning';
import VideoDigestCard from './VideoDigestCard';
import { Youtube } from 'lucide-react';

interface VideoDigestListProps {
  digests: VideoDigest[];
}

const VideoDigestList: React.FC<VideoDigestListProps> = ({ digests }) => {
  if (!digests || digests.length === 0) {
    return (
      <div className="text-center py-8">
        <Youtube className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No recommended videos available.</p>
        <p className="text-gray-400 text-sm mt-2">Related videos will be available in AI-generated modules.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Youtube className="h-5 w-5 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-900">Recommended YouTube Videos</h3>
        <span className="text-sm text-gray-500">({digests.length} videos)</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {digests.map((digest, index) => (
          <VideoDigestCard key={index} digest={digest} />
        ))}
      </div>
    </div>
  );
};

export default VideoDigestList;