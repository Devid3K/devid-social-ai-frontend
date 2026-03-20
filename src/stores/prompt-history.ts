import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'

export interface PromptHistoryItem {
  id: number
  module: string
  prompt: string
  result: unknown
  tokensUsed: number
  createdAt: string
}

export const usePromptHistoryStore = defineStore('promptHistory', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as PromptHistoryItem[],
    stats: null as Record<string, unknown> | null,
    // Pagination
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
        // TODO: map paginated response to list and total
        const resp = await ApiService.v1.PromptHistory.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          module: params?.module,
        })
        this.list = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load prompt history'
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        // TODO: map and display usage statistics
        const resp = await ApiService.v1.PromptHistory.Stats()
        this.stats = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load prompt stats'
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.PromptHistory.Delete(id)
        this.list = this.list.filter((p) => p.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete prompt history item'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(usePromptHistoryStore, import.meta.hot)
}
