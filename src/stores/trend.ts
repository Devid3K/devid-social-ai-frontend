import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type {
  TrendAnalysisResult,
  Hashtag,
  TikTokProduct,
  AnalyzeTrendParams,
  ViralScoreResult,
} from '@/types/trend.d'

export const useTrendStore = defineStore('trend', {
  state: () => ({
    loading: false,
    analyzing: false,
    error: null as string | null,
    currentAnalysis: null as TrendAnalysisResult | null,
    hashtags: [] as Hashtag[],
    tiktokProducts: [] as TikTokProduct[],
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
  },

  actions: {
    async fetchHashtags(params?: { platform?: string; region?: string }) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Trends.Hashtags(params)
        const result = resp.data?.data ?? resp.data
        this.hashtags = result.hashtags ?? result
        this.total = result.total ?? this.hashtags.length
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load hashtags'
      } finally {
        this.loading = false
      }
    },

    async analyzeTrend(params: AnalyzeTrendParams) {
      this.analyzing = true
      this.error = null
      try {
        const resp = await ApiService.v1.Trends.Analyze(params)
        const data = resp.data?.data ?? resp.data
        this.currentAnalysis = data as TrendAnalysisResult
        return data as TrendAnalysisResult
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to analyze trend'
        throw error
      } finally {
        this.analyzing = false
      }
    },

    async fetchPlatformTrends(platform: string) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Trends.Platform(platform)
        return resp.data?.data ?? resp.data
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load platform trends'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchViralScore(params: AnalyzeTrendParams) {
      try {
        const resp = await ApiService.v1.Trends.ViralScore(params)
        return (resp.data?.data ?? resp.data) as ViralScoreResult
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to calculate viral score'
        throw error
      }
    },

    async fetchTikTokProducts(params?: { page?: number; limit?: number }) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Trends.TikTokProducts({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        const result = resp.data?.data ?? resp.data
        this.tiktokProducts = result.data ?? result
        this.total = result.total ?? this.tiktokProducts.length
        this.page = result.page ?? this.page
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load TikTok products'
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useTrendStore, import.meta.hot)
}
