import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface Message {
  sender: 'user' | 'ai';
  content: string;
}

interface GeminiResponse {
  content: string;
  suggest_learning_space: boolean;
  main_prompt?: string;
}

interface LearningSpaceData {
  classroom: {
    name: string;
    description: string;
    color: string;
  };
  modules: Array<{
    title: string;
    description: string;
    step_number: number;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, action } = await req.json()
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    if (action === 'generate_learning_space') {
      // 학습 공간 생성 요청
      const learningSpaceData = await generateLearningSpace(messages, geminiApiKey)
      return new Response(
        JSON.stringify(learningSpaceData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // 일반 채팅 요청
      const response = await chatWithGemini(messages, geminiApiKey)
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error in gemini_chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        content: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.',
        suggest_learning_space: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function chatWithGemini(messages: Message[], apiKey: string): Promise<GeminiResponse> {
  const conversationHistory = messages.map(msg => 
    `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n')

  const prompt = `You are an AI learning assistant. Analyze the conversation and respond helpfully.

Conversation history:
${conversationHistory}

Instructions:
1. Provide a helpful, educational response
2. If the user is asking about learning a specific topic, skill, or subject that could benefit from structured learning, set suggest_learning_space to true
3. Extract the main learning topic/question if applicable
4. Respond in the same language as the user

Respond in JSON format:
{
  "content": "your response here",
  "suggest_learning_space": boolean,
  "main_prompt": "extracted learning topic if applicable"
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
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const generatedText = data.candidates[0].content.parts[0].text

  try {
    // JSON 응답 파싱 시도
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        content: parsed.content || generatedText,
        suggest_learning_space: parsed.suggest_learning_space || false,
        main_prompt: parsed.main_prompt
      }
    }
  } catch (parseError) {
    console.log('JSON parsing failed, using fallback')
  }

  // JSON 파싱 실패 시 폴백
  return {
    content: generatedText,
    suggest_learning_space: false
  }
}

async function generateLearningSpace(messages: Message[], apiKey: string): Promise<LearningSpaceData> {
  const conversationHistory = messages.map(msg => 
    `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n')

  const prompt = `Based on this conversation, create a structured learning curriculum.

Conversation:
${conversationHistory}

Create a comprehensive learning plan with:
1. A classroom with name, description, and color
2. 4-6 learning modules with titles, descriptions, and step numbers

Respond in JSON format:
{
  "classroom": {
    "name": "Course title",
    "description": "Detailed course description (200-300 words)",
    "color": "#hex_color"
  },
  "modules": [
    {
      "title": "Module title",
      "description": "Module description (100-150 words)",
      "step_number": 1
    }
  ]
}

Use appropriate colors and ensure content is educational and well-structured.`

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
          maxOutputTokens: 3000,
        }
      })
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const generatedText = data.candidates[0].content.parts[0].text

  try {
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (parseError) {
    console.error('Failed to parse learning space JSON:', parseError)
  }

  // 폴백 데이터
  return {
    classroom: {
      name: "AI 학습 과정",
      description: "AI와 머신러닝의 기초부터 실무 적용까지 체계적으로 학습하는 종합 과정입니다.",
      color: "#3B82F6"
    },
    modules: [
      {
        title: "AI 기초 개념",
        description: "인공지능의 기본 개념과 역사, 주요 분야에 대해 학습합니다.",
        step_number: 1
      },
      {
        title: "머신러닝 입문",
        description: "머신러닝의 기본 원리와 주요 알고리즘을 이해합니다.",
        step_number: 2
      }
    ]
  }
}