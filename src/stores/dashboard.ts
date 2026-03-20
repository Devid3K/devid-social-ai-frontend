import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { DashboardOverview, GrowthData, RevenueData, AiSuggestion, PlatformStat } from '@/types/dashboard.d'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    error: null as string | null,
    overview: null as DashboardOverview | null,
    growthData: [] as GrowthData[],
    revenueData: [] as RevenueData[],
    aiSuggestions: [] as AiSuggestion[],
    platformComparison: [] as PlatformStat[],
  }),

  getters: {
    hasData: (state) => state.overview !== null,
    totalFollowers: (state) => state.overview?.totalFollowers ?? 0,
    totalViews: (state) => state.overview?.totalViews ?? 0,
    totalRevenue: (state) => state.overview?.totalRevenue ?? 0,
    avgEngagement: (state) => state.overview?.avgEngagement ?? 0,
    platformStats: (state) => state.overview?.platformStats ?? [],
  },

  actions: {
    async fetchOverview() {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Dashboard.Overview()
        const data = resp.data?.data ?? resp.data
        this.overview = {
          totalFollowers: data.totalFollowers ?? 0,
          totalFollowersGrowth: data.totalFollowersGrowth ?? 0,
          totalViews: data.totalViews ?? 0,
          totalViewsGrowth: data.totalViewsGrowth ?? 0,
          totalRevenue: data.totalRevenue ?? 0,
          totalRevenueGrowth: data.totalRevenueGrowth ?? 0,
          avgEngagement: data.avgEngagement ?? 0,
          platformStats: (data.platformStats ?? data.platforms ?? []).map((p: any) => ({
            platform: p.platform,
            followers: p.followers ?? 0,
            followersGrowth: p.followersGrowth ?? 0,
            views: p.views ?? 0,
            viewsGrowth: p.viewsGrowth ?? 0,
            engagement: p.engagement ?? 0,
            revenue: p.revenue ?? 0,
          })),
        } as DashboardOverview
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load dashboard overview'
      } finally {
        this.loading = false
      }
    },

    async fetchGrowth(params?: { startDate?: string; endDate?: string }) {
      try {
        const resp = await ApiService.v1.Dashboard.Growth(params)
        const data = resp.data?.data ?? resp.data
        this.growthData = Array.isArray(data) ? data : []
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load growth data'
      }
    },

    async fetchRevenue(params?: { startDate?: string; endDate?: string }) {
      try {
        const resp = await ApiService.v1.Dashboard.Revenue(params)
        const data = resp.data?.data ?? resp.data
        this.revenueData = Array.isArray(data) ? data : []
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load revenue data'
      }
    },

    async fetchAiSuggestions() {
      try {
        const resp = await ApiService.v1.Dashboard.AiSuggestions()
        const data = resp.data?.data ?? resp.data
        this.aiSuggestions = Array.isArray(data) ? data : []
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load AI suggestions'
      }
    },

    async fetchPlatformComparison() {
      try {
        const resp = await ApiService.v1.Dashboard.PlatformComparison()
        const data = resp.data?.data ?? resp.data
        this.platformComparison = Array.isArray(data) ? data : []
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load platform comparison'
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useDashboardStore, import.meta.hot)
}
