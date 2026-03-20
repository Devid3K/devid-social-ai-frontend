import type { Platform } from '@/enums'

export interface SocialAccount {
  id: number
  platform: Platform
  accountName: string
  accountId: string
  profileImageUrl: string | null
  followers: number
  isActive: boolean
  lastSyncAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AnalyticsSnapshot {
  accountId: number
  platform: Platform
  followers: number
  views: number
  likes: number
  comments: number
  shares: number
  engagement: number
  revenue: number
  recordedAt: string
}
