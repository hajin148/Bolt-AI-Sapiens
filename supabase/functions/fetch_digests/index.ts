import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface YouTubeVideo {
  id: {
    videoId: string;
  };
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get API keys from environment
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!youtubeApiKey || !geminiApiKey) {
      throw new Error('API keys not configured. Please set YOUTUBE_API_KEY and GEMINI_API_KEY in Supabase environment variables.')
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
        JSON.stringify({ message: 'No channels configured. Please add channels to youtube_channels table.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processedCount = 0
    const errors: string[] = []

    // Process each channel
    for (const channel of channels) {
      try {
        console.log(`Processing channel: ${channel.name} (${channel.channel_id})`)
        
        // Get latest videos from channel (last 7 days to ensure we get content)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
          `key=${youtubeApiKey}&` +
          `channelId=${channel.channel_id}&` +
          `part=snippet&` +
          `order=date&` +
          `type=video&` +
          `publishedAfter=${sevenDaysAgo.toISOString()}&` +
          `maxResults=5`
        )

        if (!videosResponse.ok) {
          const errorText = await videosResponse.text()
          throw new Error(`YouTube API error: ${videosResponse.status} - ${errorText}`)
        }

        const videosData = await videosResponse.json()
        const videos: YouTubeVideo[] = videosData.items || []

        console.log(`Found ${videos.length} videos for channel ${channel.name}`)

        // Process each video
        for (const video of videos) {
          try {
            const videoId = video.id.videoId
            
            // Check if we already have this video
            const { data: existing } = await supabaseClient
              .from('youtube_digests')
              .select('video_id')
              .eq('video_id', videoId)
              .single()

            if (existing) {
              console.log(`Video ${videoId} already processed, skipping`)
              continue
            }

            // For now, we'll create a mock transcript since YouTube Transcript API requires additional setup
            // In production, you would integrate with a transcript service here
            const mockTranscript = `This is a sample transcript for the video titled "${video.snippet.title}". 
            This video was published on ${video.snippet.publishedAt} by ${channel.name}. 
            The content discusses various topics related to technology, innovation, and current trends in the industry. 
            This is placeholder content that would normally be replaced with the actual video transcript 
            obtained from YouTube's transcript API or a third-party service.`

            // Generate content with Gemini
            const { summary, articleContent, detectedLang } = await generateContentWithGemini(
              mockTranscript,
              video.snippet.title,
              geminiApiKey
            )

            // Insert into database
            const { error: insertError } = await supabaseClient
              .from('youtube_digests')
              .insert({
                video_id: videoId,
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
            console.log(`✅ Processed video: ${video.snippet.title}`)

          } catch (videoError) {
            console.error(`❌ Error processing video ${video.id?.videoId}:`, videoError)
            errors.push(`Video ${video.id?.videoId}: ${videoError.message}`)
          }
        }

      } catch (channelError) {
        console.error(`❌ Error processing channel ${channel.channel_id}:`, channelError)
        errors.push(`Channel ${channel.channel_id}: ${channelError.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processedCount,
        channelsProcessed: channels.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully processed ${processedCount} new videos from ${channels.length} channels`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error in fetch_digests function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateContentWithGemini(
  transcript: string,
  title: string,
  apiKey: string
): Promise<{ summary: string; articleContent: string; detectedLang: 'en' | 'ko' | 'es' | 'ja' | 'zh' | 'others' }> {
  try {
    // Simple language detection based on title and content
    const detectedLang = detectLanguage(title + ' ' + transcript)

    const prompt = `Based on this video transcript and title, please create:

1. A concise summary in exactly 40 words or less
2. A comprehensive news article (500-700 words) in Markdown format with proper headings and structure

Title: ${title}

Transcript: ${transcript}

Requirements:
- Write in a professional news tone
- Use the same language as the original content
- Include relevant headings (##) and subheadings (###)
- Make it engaging and informative
- Focus on key insights and takeaways

Please format your response as JSON:
{
  "summary": "your 40-word summary here",
  "article": "your 500-700 word markdown article here"
}`

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
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API')
    }
    
    const generatedText = data.candidates[0].content.parts[0].text

    // Try to parse JSON response
    let parsed
    try {
      // Look for JSON in the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: create structured response from unstructured text
        const lines = generatedText.split('\n')
        parsed = {
          summary: lines.slice(0, 3).join(' ').substring(0, 200),
          article: generatedText
        }
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsed = {
        summary: `Latest insights from ${title}. Key developments and analysis covered in this comprehensive overview.`,
        article: `# ${title}\n\n${generatedText}`
      }
    }
    
    return {
      summary: parsed.summary || `Summary for ${title}`,
      articleContent: parsed.article || generatedText,
      detectedLang
    }

  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    
    // Fallback content
    return {
      summary: `Latest updates and insights from ${title}. Key developments and analysis covered.`,
      articleContent: `# ${title}\n\n## Overview\n\n${transcript}\n\n## Key Takeaways\n\nThis content provides valuable insights into current trends and developments in the field.`,
      detectedLang: 'en'
    }
  }
}

function detectLanguage(text: string): 'en' | 'ko' | 'es' | 'ja' | 'zh' | 'others' {
  // Simple language detection based on character patterns
  const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
  const japanesePattern = /[ひらがなカタカナ]/
  const chinesePattern = /[\u4e00-\u9fff]/
  const spanishPattern = /[ñáéíóúü¿¡]/

  if (koreanPattern.test(text)) return 'ko'
  if (japanesePattern.test(text)) return 'ja'
  if (chinesePattern.test(text)) return 'zh'
  if (spanishPattern.test(text)) return 'es'
  
  return 'en' // Default to English
}