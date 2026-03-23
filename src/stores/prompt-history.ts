import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'

export interface PromptHistoryItem {
  id: number
  userId: number
  promptText: string | null
  platform: string | null
  viewCount: number
  likeCount: number
  shareCount: number
  salesCount: number
  revenue: number
  aiScript?: { id: number; platform: string; promptText: string } | null
  videoJob?: { id: number; status: string; videoUrl: string | null } | null
  post?: { id: number; platform: string; status: string; caption: string } | null
  createdAt: string
}

export interface PromptHistoryStats {
  totalPrompts: number
  scriptPrompts: number
  videoPrompts: number
  postPrompts: number
  recentWeekActivity: number
  topPerformers: any[]
}

export const usePromptHistoryStore = defineStore('promptHistory', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as PromptHistoryItem[],
    stats: null as PromptHistoryStats | null,
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number; module?: string }) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.PromptHistory.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          module: params?.module,
        })
        const payload = resp.data?.data ?? resp.data
        this.list = payload.data ?? payload
        this.total = payload.total ?? this.list.length
        this.page = payload.page ?? params?.page ?? this.page
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'โหลดประวัติ Prompt ไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const resp = await ApiService.v1.PromptHistory.Stats()
        this.stats = resp.data?.data ?? resp.data
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'โหลดสถิติไม่สำเร็จ'
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.PromptHistory.Delete(id)
        this.list = this.list.filter((p) => p.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ลบไม่สำเร็จ'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(usePromptHistoryStore, import.meta.hot)
}
