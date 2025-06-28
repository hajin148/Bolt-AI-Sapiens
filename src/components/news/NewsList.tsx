import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { DigestCardData } from '../../types/News';
import DigestCard from './DigestCard';
import { Loader2, RefreshCw, Search, Filter, Calendar, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ITEMS_PER_PAGE = 20;

const NewsList: React.FC = () => {
  const [digests, setDigests] = useState<DigestCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

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

        // Apply language filter
        if (selectedLanguage !== 'all') {
          query = query.eq('lang', selectedLanguage);
        }

        // Apply search filter
        if (searchQuery.trim()) {
          query = query.ilike('title', `%${searchQuery.trim()}%`);
        }

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
    [searchQuery, selectedLanguage],
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDigests(0, true);
  };

  const languages = [
    { code: 'all', label: 'All Languages', flag: '🌐' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading AI News</h3>
          <p className="text-gray-600">Fetching the latest updates...</p>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
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
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-600 mb-6">
          {searchQuery || selectedLanguage !== 'all' 
            ? 'Try adjusting your search or filters.' 
            : 'Run the fetch_digests function to populate with YouTube content.'
          }
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">AI News</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest developments in artificial intelligence through curated content from top YouTube channels
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
          <Globe className="h-4 w-4" />
          Latest AI Updates
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </form>

            {/* Language Filter */}
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="h-14 px-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 bg-white text-base min-w-[160px]"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="h-14 px-6 border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{digests.length} articles found</span>
              </div>
              {(searchQuery || selectedLanguage !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLanguage('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {digests.map((digest, index) => (
            <DigestCard key={`${digest.video_id}-${index}`} digest={digest} />
          ))}
        </div>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-12">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="px-8 py-4 border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-xl text-base"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}

      {!hasMore && digests.length > 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full text-gray-600 text-sm">
            <span>You've reached the end</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsList;