import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { DashboardOverview, GrowthData, RevenueData, AiSuggestion } from '@/types/dashboard.d'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    error: null as string | null,
    overview: null as DashboardOverview | null,
    growthData: [] as GrowthData[],
    revenueData: [] as RevenueData[],
    aiSuggestions: [] as AiSuggestion[],
  }),

  getters: {
    hasData: (state) => state.overview !== null,
  },

  actions: {
    async fetchOverview() {
      this.loading = true
      this.error = null
      try {
        // TODO: parse and map API response shape to DashboardOverview
        const resp = await ApiService.v1.Dashboard.Overview()
        this.overview = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load dashboard overview'
      } finally {
        this.loading = false
      }
    },

    async fetchGrowth(params?: { startDate?: string; endDate?: string }) {
      try {
        // TODO: parse and map growth data
        const resp = await ApiService.v1.Dashboard.Growth(params)
        this.growthData = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load growth data'
      }
    },

    async fetchRevenue(params?: { startDate?: string; endDate?: string }) {
      try {
        // TODO: parse and map revenue data
        const resp = await ApiService.v1.Dashboard.Revenue(params)
        this.revenueData = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load revenue data'
      }
    },

    async fetchAiSuggestions() {
      try {
        // TODO: parse and map AI suggestion items
        const resp = await ApiService.v1.Dashboard.AiSuggestions()
        this.aiSuggestions = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load AI suggestions'
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useDashboardStore, import.meta.hot)
}
