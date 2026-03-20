import type { Platform } from '@/enums'

export interface PlatformStat {
  platform: Platform
  followers: number
  followersGrowth: number
  views: number
  viewsGrowth: number
  engagement: number
  revenue: number
}

export interface GrowthData {
  date: string
  followers: number
  views: number
  engagement: number
}

export interface RevenueData {
  date: string
  income: number
  expense: number
  profit: number
}

export interface AiSuggestion {
  id: number
  type: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

export interface DashboardOverview {
  totalFollowers: number
  totalFollowersGrowth: number
  totalViews: number
  totalViewsGrowth: number
  totalRevenue: number
  totalRevenueGrowth: number
  avgEngagement: number
  platformStats: PlatformStat[]
}
