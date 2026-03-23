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

export interface TikTokProduct {
  id: string
  name: string
  category: string
  trendScore: number
  salesVolume: number
  commissionRate: number
  videoCount: number
  thumbnailUrl: string | null
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
