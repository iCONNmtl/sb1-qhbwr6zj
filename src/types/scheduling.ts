import type { GenerationPlatform } from './mockup';

export type ScheduledPostStatus = 'scheduled' | 'published' | 'failed';

export interface ScheduledPost {
  id: string;
  userId: string;
  mockups: {
    id: string;
    name: string;
    url: string;
    platform?: GenerationPlatform;
  }[];
  platforms: {
    platform: string;
    productId?: string;
    content?: string;
  }[];
  scheduledFor: string;
  status: ScheduledPostStatus;
  createdAt: string;
  publishedAt?: string;
  error?: string;
}