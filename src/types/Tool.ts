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