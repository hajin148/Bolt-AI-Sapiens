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

interface ContentItem {
  type: 'text' | 'code' | 'exercise';
  value: string;
  language?: string;
}

interface VideoDigest {
  title: string;
  url: string;
  duration: string;
  thumbnail?: string;
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
    content: ContentItem[];
    digests: VideoDigest[];
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
      // Learning space generation request
      const learningSpaceData = await generateLearningSpace(messages, geminiApiKey)
      return new Response(
        JSON.stringify(learningSpaceData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Regular chat request
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
        content: 'Sorry, an error occurred. Please try again.',
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
4. Respond in Korean for Korean users, English for others

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
    // Try to parse JSON response
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

  // Fallback if JSON parsing fails
  return {
    content: generatedText,
    suggest_learning_space: false
  }
}

async function generateLearningSpace(messages: Message[], apiKey: string): Promise<LearningSpaceData> {
  const conversationHistory = messages.map(msg => 
    `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n')

  const prompt = `Based on this conversation, create a comprehensive learning curriculum with detailed content and YouTube video recommendations.

Conversation:
${conversationHistory}

Create a structured learning plan with:
1. A classroom with name, description, and color
2. 4-6 learning modules with titles, descriptions, step numbers, detailed content, and YouTube video recommendations

For each module, include:
- content: Array of learning items with types: "text", "code", "exercise"
- digests: Array of YouTube video recommendations with title, url, duration

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
      "step_number": 1,
      "content": [
        {
          "type": "text",
          "value": "Detailed explanation text"
        },
        {
          "type": "code",
          "language": "python",
          "value": "# Sample code\nprint('Hello World')"
        },
        {
          "type": "exercise",
          "value": "Practice exercise description"
        }
      ],
      "digests": [
        {
          "title": "Video title",
          "url": "https://www.youtube.com/watch?v=example",
          "duration": "12:04"
        }
      ]
    }
  ]
}

Use appropriate colors and ensure content is educational and well-structured. Include realistic YouTube URLs and durations.`

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
          maxOutputTokens: 4000,
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

  // Fallback data with enhanced content structure
  return {
    classroom: {
      name: "AI 학습 과정",
      description: "인공지능과 머신러닝의 기초부터 실제 응용까지 다루는 종합적인 학습 과정입니다. 이론적 개념부터 실습 프로젝트까지 단계별로 학습할 수 있도록 구성되었습니다.",
      color: "#3B82F6"
    },
    modules: [
      {
        title: "AI 기초 개념",
        description: "인공지능의 기본 개념과 역사, 주요 응용 분야에 대해 학습합니다.",
        step_number: 1,
        content: [
          {
            type: "text",
            value: "인공지능(AI)은 인간의 지능을 모방하여 학습, 추론, 문제 해결 등을 수행하는 컴퓨터 시스템입니다. 1950년대부터 시작된 AI 연구는 현재 우리 일상생활의 많은 부분에 적용되고 있습니다."
          },
          {
            type: "exercise",
            value: "주변에서 AI가 사용되는 사례 3가지를 찾아보고, 각각이 어떤 AI 기술을 사용하는지 조사해보세요."
          }
        ],
        digests: [
          {
            title: "What is Artificial Intelligence?",
            url: "https://www.youtube.com/watch?v=ad79nYk2keg",
            duration: "15:30"
          }
        ]
      },
      {
        title: "머신러닝 입문",
        description: "머신러닝의 핵심 개념과 주요 알고리즘에 대해 학습합니다.",
        step_number: 2,
        content: [
          {
            type: "text",
            value: "머신러닝은 데이터로부터 패턴을 학습하여 예측이나 결정을 내리는 AI의 한 분야입니다. 지도학습, 비지도학습, 강화학습으로 구분됩니다."
          },
          {
            type: "code",
            language: "python",
            value: "# 간단한 선형 회귀 예제\nfrom sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# 데이터 준비\nX = np.array([[1], [2], [3], [4]])\ny = np.array([2, 4, 6, 8])\n\n# 모델 학습\nmodel = LinearRegression()\nmodel.fit(X, y)\n\n# 예측\nprediction = model.predict([[5]])\nprint(f'예측값: {prediction[0]}')"
          },
          {
            type: "exercise",
            value: "위의 코드를 실행해보고, 다른 데이터셋으로 선형 회귀를 구현해보세요."
          }
        ],
        digests: [
          {
            title: "Machine Learning Explained",
            url: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
            duration: "18:20"
          }
        ]
      }
    ]
  }
}