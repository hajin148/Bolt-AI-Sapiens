export interface Classroom {
  id: string;
  name: string;
  description: string;
  color: string;
  user_id: string;
  created_at: string;
  module_count?: number;
}

export interface ContentItem {
  type: 'text' | 'code' | 'exercise';
  value: string;
  language?: string; // for code blocks
}

// Enhanced video digest to handle both simple and complex structures
export interface VideoDigest {
  video_id?: string;
  title: string;
  url?: string;
  duration?: string;
  thumbnail?: string;
  published_at?: string;
  summary?: string;
  lang?: string;
  youtube_channels?: {
    name: string;
  };
}

export interface Module {
  id: string;
  classroom_id: string;
  title: string;
  description: string;
  step_number: number;
  created_at: string;
  content?: ContentItem[];
  digests?: VideoDigest[];
}

export interface CreateClassroomData {
  name: string;
  description: string;
  color: string;
}

export interface CreateModuleData {
  classroom_id: string;
  title: string;
  description: string;
  step_number: number;
  content?: ContentItem[];
  digests?: VideoDigest[];
}