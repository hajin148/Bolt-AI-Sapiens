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