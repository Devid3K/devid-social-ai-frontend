import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { AiScript, GenerateScriptParams } from '@/types/script.d'

export const useScriptStore = defineStore('script', {
  state: () => ({
    loading: false,
    generating: false,
    error: null as string | null,
    list: [] as AiScript[],
    current: null as AiScript | null,
    // Pagination
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
        const resp = await ApiService.v1.AiScript.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        this.list = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load scripts'
      } finally {
        this.loading = false
      }
    },

    async generate(params: GenerateScriptParams) {
      this.generating = true
      this.error = null
      try {
        // TODO: handle and store generated script result
        const resp = await ApiService.v1.AiScript.Generate(params)
        this.current = resp.data
        return resp.data as AiScript
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to generate script'
        throw error
      } finally {
        this.generating = false
      }
    },

    async selectVariant(id: number, scriptIndex: number) {
      try {
        // TODO: update local list item selected index after API call
        await ApiService.v1.AiScript.Select(id, { scriptIndex })
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to select script variant'
        throw error
      }
    },

    async fetchViralScore(id: number) {
      try {
        // TODO: store viral score result on the current script
        const resp = await ApiService.v1.AiScript.ViralScore(id)
        return resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to fetch viral score'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useScriptStore, import.meta.hot)
}
