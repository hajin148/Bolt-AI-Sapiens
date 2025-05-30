export interface Tool {
  name: string;
  url: string;
  iconUrl: string;
  description: string;
  descriptionEn?: string;
  category: string;
}

export interface CategoryInfo {
  id: string;
  title: string;
  titleEn?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
}

export interface UserProfile {
  username: string;
  email: string;
  phone?: string;
  job: string;
  interests: string[];
  favorites: string[];
  isPaid?: boolean;
}

export const JOB_OPTIONS = [
  'Developer',
  'Designer',
  'Product Manager',
  'Marketer',
  'Researcher',
  'Educator',
  'Entrepreneur',
  'Student',
  'Freelancer',
  'Other'
] as const;

export const INTEREST_OPTIONS = [
  'Video Editing',
  'Web Development',
  'App Development',
  'UI/UX Design',
  'Data Visualization',
  'Game Development',
  'AI/ML',
  'No-code Tools',
  'Marketing Automation',
  'Audio/Music Creation'
] as const;

export type JobType = typeof JOB_OPTIONS[number];
export type InterestType = typeof INTEREST_OPTIONS[number];