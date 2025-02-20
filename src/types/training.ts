export type TrainingStatus = 'draft' | 'published';
export type TrainingAccess = 'free' | 'premium';

export interface TrainingSection {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  status: TrainingStatus;
  access: TrainingAccess;
  credits: number;
  sections: TrainingSection[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}