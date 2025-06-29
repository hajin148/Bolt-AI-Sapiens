import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArticleData } from '../../types/News';
import { ArrowLeft, Calendar, User, Globe, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ArticlePage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!videoId) {
        setError('Video ID not provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('youtube_digests')
          .select(`
            video_id,
            title,
            published_at,
            article_content,
            lang,
            channel_id,
            thumbnail,
            summary,
            youtube_channels(name)
          `)
          .eq('video_id', videoId)
          .single();

        if (error) throw error;
        if (!data) {
          setError('Article not found');
          return;
        }

        setArticle({
          video_id: data.video_id,
          title: data.title,
          published_at: data.published_at,
          article_content: data.article_content,
          lang: data.lang,
          channel_id: data.channel_id,
          channel_name: data.youtube_channels?.name ?? 'Unknown Channel',
          thumbnail: data.thumbnail,
          summary: data.summary,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [videoId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-bold mt-8 mb-4 text-white">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-bold mt-10 mb-6 text-white">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold mt-10 mb-6 text-white">{line.slice(2)}</h1>;
        }
        
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const italicText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return (
          <p 
            key={index} 
            className="mb-6 text-gray-300 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: italicText }}
          />
        );
      });
  };

  const getYouTubeUrl = () => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Loading article...</h3>
          <p className="text-gray-400">Please wait while we fetch the content</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            onClick={() => navigate('/news')}
            variant="ghost"
            className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
            <Button onClick={() => navigate('/news')} className="bg-blue-600 hover:bg-blue-700">
              Return to News Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <Button
          onClick={() => navigate('/news')}
          variant="ghost"
          className="mb-8 text-gray-300 hover:text-white hover:bg-gray-800 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          {/* Title and Meta Information */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            
            {/* Summary */}
            {article.summary && (
              <div className="bg-blue-600/10 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <p className="text-lg text-blue-200 leading-relaxed font-medium">
                  {article.summary}
                </p>
              </div>
            )}

            {/* Meta Information Row */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-700">
              {article.channel_name && (
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="h-5 w-5" />
                  <span className="font-medium text-lg">{article.channel_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-5 w-5" />
                <span className="text-lg">{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Globe className="h-5 w-5" />
                <span className="flex items-center gap-1 text-lg">
                  {getLanguageFlag(article.lang)}
                  {article.lang.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.open(getYouTubeUrl(), '_blank')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Watch on YouTube
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-gray-900/50 rounded-2xl p-8 md:p-12 border border-gray-800">
          <div className="prose prose-lg max-w-none">
            {article.article_content ? (
              <div className="text-gray-300 leading-relaxed">
                {renderMarkdown(article.article_content)}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Content Not Available</h3>
                <p className="text-gray-400 mb-6">The article content may not have been processed yet.</p>
                <Button
                  onClick={() => window.open(getYouTubeUrl(), '_blank')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Original Video
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-400">
            <span>🤖</span>
            <span>This article was generated from a YouTube video transcript using AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;