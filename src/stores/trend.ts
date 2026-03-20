import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import { Platform } from '@/enums'
import type { TrendAnalysis, Hashtag, TikTokProduct } from '@/types/trend.d'

export const useTrendStore = defineStore('trend', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as TrendAnalysis[],
    hashtags: [] as Hashtag[],
    tiktokProducts: [] as TikTokProduct[],
    // Pagination for products
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number }) {
      this.loading = true
      this.error = null
      try {
        // TODO: map paginated response to list and total
        const resp = await ApiService.v1.Trends.Hashtags({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        this.hashtags = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.hashtags.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load trends'
      } finally {
        this.loading = false
      }
    },

    async analyzeTrend(data: { topic: string; platform: Platform }) {
      this.loading = true
      this.error = null
      try {
        // TODO: push result into list or set as current analysis
        const resp = await ApiService.v1.Trends.Analyze(data)
        return resp.data as TrendAnalysis
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to analyze trend'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPlatformTrends(platform: Platform) {
      this.loading = true
      this.error = null
      try {
        // TODO: map platform trend data
        const resp = await ApiService.v1.Trends.Platform(platform)
        return resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load platform trends'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTikTokProducts(params?: { page?: number; limit?: number }) {
      this.loading = true
      this.error = null
      try {
        // TODO: map paginated TikTok products response
        const resp = await ApiService.v1.Trends.TikTokProducts({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        this.tiktokProducts = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.tiktokProducts.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load TikTok products'
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useTrendStore, import.meta.hot)
}
