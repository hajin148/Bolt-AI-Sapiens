export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  isPaid: boolean;
  url: string;
  tags: string[];
  rating: number;
  reviews: number;
  image: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  job: string;
  interests: string[];
  favorites: string[];
  is_paid: boolean;
  created_at?: string;
  updated_at?: string;
}

export const JOB_OPTIONS = [
  'Software Developer',
  'Data Scientist',
  'Product Manager',
  'Designer',
  'Marketing Manager',
  'Sales Representative',
  'Business Analyst',
  'Project Manager',
  'Consultant',
  'Entrepreneur',
  'Student',
  'Other'
] as const;

export const INTEREST_OPTIONS = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Blockchain',
  'IoT',
  'Game Development',
  'UI/UX Design',
  'Digital Marketing',
  'E-commerce',
  'Productivity',
  'Project Management',
  'Analytics',
  'Automation',
  'API Development',
  'Database Management'
] as const;

export type JobType = typeof JOB_OPTIONS[number];
export type InterestType = typeof INTEREST_OPTIONS[number];