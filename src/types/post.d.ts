import type { Platform, PostStatus } from '@/enums'

export interface Post {
  id: number
  platform: Platform
  accountId: number
  content: string
  mediaUrls: string[]
  hashtags: string[]
  status: PostStatus
  scheduledAt: string | null
  publishedAt: string | null
  views: number
  likes: number
  comments: number
  shares: number
  createdAt: string
  updatedAt: string
}

export interface CreatePostParams {
  platform: Platform
  accountId: number
  content: string
  mediaUrls?: string[]
  hashtags?: string[]
}

export interface SchedulePostParams {
  scheduledAt: string
}
