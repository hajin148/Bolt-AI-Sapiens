export interface PromptSession {
  id: string;
  user_id: string;
  main_prompt: string | null;
  title: string;
  tags: string[];
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}

export interface LearningSpaceLink {
  id: string;
  prompt_session_id: string;
  classroom_id: string;
  created_at: string;
}

export interface CreatePromptSessionData {
  title?: string;
  tags?: string[];
}

export interface CreatePromptMessageData {
  session_id: string;
  sender: 'user' | 'ai';
  content: string;
}

export interface GeminiResponse {
  content: string;
  main_prompt?: string;
  suggest_learning_space?: boolean;
}

export interface LearningSpaceGenerationData {
  classroom: {
    name: string;
    description: string;
    theme_color: string;
  };
  modules: Array<{
    title: string;
    description: string;
    step: number;
  }>;
}