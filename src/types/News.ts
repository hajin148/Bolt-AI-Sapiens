export interface YouTubeChannel {
  channel_id: string;
  name: string;
  added_at: string;
}

export interface YouTubeDigest {
  video_id: string;
  channel_id: string;
  lang: 'en' | 'ko' | 'es' | 'ja' | 'zh' | 'others';
  title: string;
  thumbnail: string | null;
  published_at: string;
  summary: string | null;
  article_content: string | null;
  fetched_at: string;
}

export interface DigestCardData {
  video_id: string;
  title: string;
  thumbnail: string | null;
  published_at: string;
  summary: string | null;
  lang: 'en' | 'ko' | 'es' | 'ja' | 'zh' | 'others';
  channel_name?: string;
}

export interface ArticleData {
  video_id: string;
  title: string;
  published_at: string;
  article_content: string | null;
  lang: 'en' | 'ko' | 'es' | 'ja' | 'zh' | 'others';
  channel_id: string;
  channel_name?: string;
  thumbnail?: string | null;
  summary?: string | null;
}