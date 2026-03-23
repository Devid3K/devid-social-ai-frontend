import type { Platform } from '@/enums'

export interface TrendAnalysisResult {
  id: number
  topic: string
  platforms: string[]
  viralScore: number
  starRating: number
  analysis: string
  hashtags: string[]
  trendData: { date: string; value: number }[]
  relatedQueries: string[]
  insights: string[]
}

export interface Hashtag {
  tag: string
  viewCount: number
  videoCount: number
  trend: 'rising' | 'stable' | 'falling'
  platform: string
}

export interface TikTokRelatedClip {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  author: string
  authorAvatar: string
  duration: number
  isAiGenerated: boolean
  postedAt: string
}

export interface TikTokProduct {
  id: string
  name: string
  category: string
  trendScore: number
  salesVolume: number
  commissionRate: number
  videoCount: number
  thumbnail: string
  description: string
  priceRange: string
  relatedHashtags: string[]
  topClips: TikTokRelatedClip[]
}

export interface TikTokClipsResponse {
  product: { id: string; name: string; category: string }
  clips: TikTokRelatedClip[]
  total: number
  aiCount: number
  organicCount: number
}

export interface ViralScoreResult {
  score: number
  factors: string[]
  direction: 'rising' | 'stable' | 'falling'
}

export interface ChannelFitResult {
  accountId: number
  accountName: string
  platform: string
  fitScore: number
  trendingHashtags: string[]
  suggestions: string[]
}

export interface AnalyzeTrendParams {
  topic: string
  platforms?: string[]
  region?: string
  timeframe?: '24h' | '7d' | '30d' | '90d'
}
