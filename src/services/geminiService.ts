import { GeminiResponse, LearningSpaceGenerationData } from '../types/Prompt';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class GeminiService {
  private static async callGeminiAPI(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  }

  static async generateResponse(userMessage: string, conversationHistory: string[]): Promise<GeminiResponse> {
    const conversationContext = conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.join('\n')}\n\n`
      : '';

    const prompt = `${conversationContext}User: ${userMessage}

Please respond naturally to the user's message. Additionally, analyze the conversation to:
1. Extract the main learning topic or goal if one emerges
2. Determine if this conversation would benefit from creating a structured learning space

Format your response as JSON:
{
  "content": "Your natural response to the user",
  "main_prompt": "Brief description of the main learning topic (if identified)",
  "suggest_learning_space": true/false
}`;

    try {
      const response = await this.callGeminiAPI(prompt);
      
      // Try to parse JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            content: parsed.content || response,
            main_prompt: parsed.main_prompt,
            suggest_learning_space: parsed.suggest_learning_space || false
          };
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using raw text');
      }

      // Fallback to raw response
      return {
        content: response,
        main_prompt: undefined,
        suggest_learning_space: false
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  static async generateLearningSpace(conversationHistory: string[]): Promise<LearningSpaceGenerationData> {
    const conversation = conversationHistory.join('\n');
    
    const prompt = `Based on this conversation, create a structured learning curriculum:

${conversation}

Generate a JSON response with a classroom and modules:
{
  "classroom": {
    "name": "Clear, descriptive name for the learning topic",
    "description": "Detailed description of what students will learn (2-3 sentences)",
    "theme_color": "#hexcolor (choose an appropriate color)"
  },
  "modules": [
    {
      "title": "Module title",
      "description": "What students will learn in this module",
      "step": 1
    }
  ]
}

Create 3-6 modules that progress logically from basics to advanced topics.`;

    try {
      const response = await this.callGeminiAPI(prompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate the structure
        if (parsed.classroom && parsed.modules && Array.isArray(parsed.modules)) {
          return parsed;
        }
      }
      
      throw new Error('Invalid learning space structure generated');
    } catch (error) {
      console.error('Failed to generate learning space:', error);
      throw new Error('Failed to generate learning space. Please try again.');
    }
  }
}