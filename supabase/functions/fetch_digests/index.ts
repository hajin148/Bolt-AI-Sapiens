import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelId: string;
  };
}

interface TranscriptItem {
  text: string;
  start: number;
  duration: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get YouTube API key from environment
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    if (!youtubeApiKey) {
      throw new Error('YouTube API key not configured')
    }

    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // Fetch all channels from database
    const { data: channels, error: channelsError } = await supabaseClient
      .from('youtube_channels')
      .select('channel_id, name')

    if (channelsError) {
      throw channelsError
    }

    if (!channels || channels.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No channels configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processedCount = 0
    const errors: string[] = []

    // Process each channel
    for (const channel of channels) {
      try {
        // Get latest videos from channel (last 24 hours)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
          `key=${youtubeApiKey}&` +
          `channelId=${channel.channel_id}&` +
          `part=snippet&` +
          `order=date&` +
          `type=video&` +
          `publishedAfter=${yesterday.toISOString()}&` +
          `maxResults=5`
        )

        if (!videosResponse.ok) {
          throw new Error(`YouTube API error: ${videosResponse.status}`)
        }

        const videosData = await videosResponse.json()
        const videos: YouTubeVideo[] = videosData.items || []

        // Process each video
        for (const video of videos) {
          try {
            // Check if we already have this video
            const { data: existing } = await supabaseClient
              .from('youtube_digests')
              .select('video_id')
              .eq('video_id', video.id)
              .single()

            if (existing) {
              continue // Skip if already processed
            }

            // Get transcript using youtube-transcript-api
            const transcript = await getVideoTranscript(video.id)
            
            if (!transcript) {
              console.log(`No transcript available for video ${video.id}`)
              continue
            }

            // Detect language and generate content with Gemini
            const { summary, articleContent, detectedLang } = await generateContentWithGemini(
              transcript,
              geminiApiKey
            )

            // Insert into database
            const { error: insertError } = await supabaseClient
              .from('youtube_digests')
              .insert({
                video_id: video.id,
                channel_id: channel.channel_id,
                lang: detectedLang,
                title: video.snippet.title,
                thumbnail: video.snippet.thumbnails.medium.url,
                published_at: video.snippet.publishedAt,
                summary: summary,
                article_content: articleContent,
                fetched_at: new Date().toISOString()
              })

            if (insertError) {
              throw insertError
            }

            processedCount++
            console.log(`Processed video: ${video.snippet.title}`)

          } catch (videoError) {
            console.error(`Error processing video ${video.id}:`, videoError)
            errors.push(`Video ${video.id}: ${videoError.message}`)
          }
        }

      } catch (channelError) {
        console.error(`Error processing channel ${channel.channel_id}:`, channelError)
        errors.push(`Channel ${channel.channel_id}: ${channelError.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processedCount,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in fetch_digests function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function getVideoTranscript(videoId: string): Promise<string | null> {
  try {
    // This is a simplified version - in production you'd use a proper transcript API
    // For now, we'll return a placeholder
    console.log(`Getting transcript for video ${videoId}`)
    
    // You would implement actual transcript fetching here
    // This could use youtube-transcript-api or similar service
    
    return null // Placeholder - implement actual transcript fetching
  } catch (error) {
    console.error(`Error getting transcript for ${videoId}:`, error)
    return null
  }
}

async function generateContentWithGemini(
  transcript: string,
  apiKey: string
): Promise<{ summary: string; articleContent: string; detectedLang: 'en' | 'ko' | 'es' | 'ja' | 'zh' | 'others' }> {
  try {
    // Detect language (simplified - you could use a proper language detection service)
    const detectedLang = detectLanguage(transcript)

    const prompt = `
Based on this video transcript, please:

1. Write a concise summary in 40 words or less
2. Write a comprehensive news article (500-700 words) in Markdown format

Please maintain the original language of the transcript. Use a professional news tone.

Transcript:
${transcript}

Please format your response as JSON:
{
  "summary": "your 40-word summary here",
  "article": "your 500-700 word markdown article here"
}
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    // Parse JSON response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse Gemini response as JSON')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    return {
      summary: parsed.summary,
      articleContent: parsed.article,
      detectedLang
    }

  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    throw error
  }
}

function detectLanguage(text: string): 'en' | 'ko' | 'es' | 'ja' | 'zh' | 'others' {
  // Simple language detection based on character patterns
  const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
  const japanesePattern = /[ひらがなカタカナ]/
  const chinesePattern = /[\u4e00-\u9fff]/
  const spanishPattern = /[ñáéíóúü]/

  if (koreanPattern.test(text)) return 'ko'
  if (japanesePattern.test(text)) return 'ja'
  if (chinesePattern.test(text)) return 'zh'
  if (spanishPattern.test(text)) return 'es'
  
  return 'en' // Default to English
}