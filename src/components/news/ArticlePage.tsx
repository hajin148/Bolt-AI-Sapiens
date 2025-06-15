import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArticleData } from '../../types/News';
import { ArrowLeft, Calendar, User, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
        console.log(`Fetching article for video ID: ${videoId}`);

        const { data, error: fetchError } = await supabase
          .from('youtube_digests')
          .select(`
            video_id,
            title,
            published_at,
            article_content,
            lang,
            channel_id
          `)
          .eq('video_id', videoId)
          .single();

        console.log('Article data:', data);
        console.log('Article error:', fetchError);

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          setError('Article not found');
          return;
        }

        // Get channel name separately
        let channelName = 'Unknown Channel';
        if (data.channel_id) {
          const { data: channelData } = await supabase
            .from('youtube_channels')
            .select('name')
            .eq('channel_id', data.channel_id)
            .single();

          if (channelData) {
            channelName = channelData.name;
          }
        }

        setArticle({
          video_id: data.video_id,
          title: data.title,
          published_at: data.published_at,
          article_content: data.article_content,
          lang: data.lang,
          channel_id: data.channel_id,
          channel_name: channelName
        });
      } catch (err) {
        console.error('Error fetching article:', err);
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
    // Simple markdown renderer for basic formatting
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-900">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900">{line.slice(2)}</h1>;
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Bold text
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic text
        const italicText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Regular paragraphs
        return (
          <p 
            key={index} 
            className="mb-4 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: italicText }}
          />
        );
      });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading article...</span>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/news')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error || 'Article not found'}</div>
          <Button onClick={() => navigate('/news')} variant="outline">
            Return to News Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <Button
        onClick={() => navigate('/news')}
        variant="ghost"
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Button>

      {/* Article */}
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b border-gray-200 pb-6">
              {article.channel_name && (
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-medium">{article.channel_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span className="flex items-center gap-1">
                  {getLanguageFlag(article.lang)}
                  {article.lang.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {article.article_content ? (
              <div className="text-gray-800 leading-relaxed">
                {renderMarkdown(article.article_content)}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Article content is not available.</p>
                <p className="text-sm mt-2">The transcript may not have been processed yet.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              This article was generated from a YouTube video transcript using AI.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticlePage;