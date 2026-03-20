import type { Platform } from '@/enums'

export interface TrendAnalysis {
  id: number
  platform: Platform
  topic: string
  viralScore: number
  engagement: number
  hashtags: Hashtag[]
  insights: string[]
  analyzedAt: string
}

export interface Hashtag {
  tag: string
  count: number
  trend: 'rising' | 'stable' | 'falling'
  platform: Platform
}

export interface TikTokProduct {
  id: string
  name: string
  category: string
  price: number
  salesVolume: number
  commissionRate: number
  viralScore: number
  videoCount: number
  thumbnailUrl: string | null
}
