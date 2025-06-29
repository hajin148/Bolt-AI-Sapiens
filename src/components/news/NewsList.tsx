import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { DigestCardData } from '../../types/News';
import DigestCard from './DigestCard';
import { Loader2, RefreshCw, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 20;

const NewsList: React.FC = () => {
  const [digests, setDigests] = useState<DigestCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDigests = useCallback(
    async (offset = 0, isRefresh = false) => {
      try {
        offset === 0 ? setLoading(true) : setLoadingMore(true);
        setError(null);

        let query = supabase
          .from('youtube_digests')
          .select(`
            video_id,
            title,
            thumbnail,
            published_at,
            summary,
            lang,
            youtube_channels(name)
          `)
          .order('published_at', { ascending: false });

        const { data, error } = await query.range(offset, offset + ITEMS_PER_PAGE - 1);

        if (error) throw error;

        const formatted: DigestCardData[] = (data ?? []).map((d) => ({
          video_id: d.video_id,
          title: d.title,
          thumbnail: d.thumbnail,
          published_at: d.published_at,
          summary: d.summary,
          lang: d.lang,
          channel_name: d.youtube_channels?.name ?? null,
        }));

        setDigests((prev) =>
          offset === 0 || isRefresh ? formatted : [...prev, ...formatted],
        );
        setHasMore(formatted.length === ITEMS_PER_PAGE);
      } catch (err) {
        console.error(err);
        setError('Failed to load news articles. Please try again.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchDigests();
  }, [fetchDigests]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchDigests(digests.length);
    }
  };

  const handleRefresh = () => {
    fetchDigests(0, true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Loading AI News</h3>
          <p className="text-gray-400">Fetching the latest updates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (digests.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No articles found</h3>
        <p className="text-gray-400 mb-6">
          Run the fetch_digests function to populate with YouTube content.
        </p>
        <Button onClick={handleRefresh} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full text-blue-400 text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          Latest AI Updates
        </div>
        <h1 className="text-4xl font-bold text-white">AI News & Insights</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Stay updated with the latest developments in artificial intelligence through curated content from top YouTube channels
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Line - Blue to Green Gradient */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500"></div>
        
        {/* News Items */}
        <div className="space-y-8">
          {digests.map((digest, index) => (
            <div key={`${digest.video_id}-${index}`} className="relative">
              {/* Timeline Dot */}
              <div className="absolute left-6 w-4 h-4 bg-[#121212] border-4 border-blue-500 rounded-full shadow-lg z-10"></div>
              
              {/* Content */}
              <div className="ml-20">
                <DigestCard digest={digest} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-8">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="px-8 py-3 border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 hover:bg-gray-800"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5 mr-2" />
                Load More Articles
              </>
            )}
          </Button>
        </div>
      )}

      {!hasMore && digests.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-gray-400 text-sm">
            <span>You've reached the end</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsList;