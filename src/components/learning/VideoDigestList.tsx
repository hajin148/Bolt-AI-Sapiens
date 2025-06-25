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
        <p className="text-gray-500">추천 영상이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">AI가 생성한 새로운 모듈에서 관련 영상을 확인할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Youtube className="h-5 w-5 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-900">추천 유튜브 영상</h3>
        <span className="text-sm text-gray-500">({digests.length}개)</span>
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