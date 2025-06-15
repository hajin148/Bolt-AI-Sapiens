import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { DigestCardData } from '../../types/News';
import DigestCard from './DigestCard';
import { Loader2, RefreshCw } from 'lucide-react';
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

        const { data, error: fetchError } = await supabase
          .from('youtube_digests')
          .select(
            `
            video_id,
            title,
            thumbnail,
            published_at,
            summary,
            lang,
            youtube_channels(name)
          `,
          )
          .order('published_at', { ascending: false })
          .range(offset, offset + ITEMS_PER_PAGE - 1);

        if (fetchError) throw fetchError;

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
        console.error('Error fetching digests:', err);
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading latest news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (digests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">No news articles available yet.</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">YouTube News</h1>
          <p className="text-gray-600 mt-1">Latest AI-generated news summaries from YouTube videos</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* News Grid */}
      <div className="space-y-4">
        {digests.map((digest) => (
          <DigestCard key={digest.video_id} digest={digest} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-6">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}

      {!hasMore && digests.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          You've reached the end of the news feed.
        </div>
      )}
    </div>
  );
};

export default NewsList;