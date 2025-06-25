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
  suggest_learning_space?: boolean;
}

export interface CreatePromptSessionData {
  title: string;
  main_prompt?: string;
  tags?: string[];
}

export interface CreatePromptMessageData {
  session_id: string;
  sender: 'user' | 'ai';
  content: string;
}

export interface GeminiResponse {
  content: string;
  suggest_learning_space: boolean;
  main_prompt?: string;
}

export interface LearningSpaceData {
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