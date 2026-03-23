import type { Platform, PostStatus } from '@/enums'

export interface PostSocialAccount {
  id: number
  platform: Platform
  accountName: string
}

export interface PostVideoJob {
  id: number
  videoUrl: string | null
  thumbnailUrl: string | null
  status: string
}

export interface Post {
  id: number
  userId: number
  socialAccountId: number
  socialAccount?: PostSocialAccount
  videoJob?: PostVideoJob | null
  videoJobId: number | null
  platform: Platform
  caption: string | null
  hashtags: string[]
  status: PostStatus
  scheduledAt: string | null
  publishedAt: string | null
  platformPostId: string | null
  viewCount: number
  likeCount: number
  shareCount: number
  commentCount: number
  revenue: number
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePostParams {
  socialAccountId: number
  platform: Platform
  caption?: string
  hashtags?: string[]
  videoJobId?: number
  scriptId?: number
}

export interface SchedulePostParams {
  scheduledAt: string
  timezone?: string
}

export interface PostPerformance {
  viewCount: number
  likeCount: number
  shareCount: number
  commentCount: number
  revenue: number
  lastSynced: string | null
}
