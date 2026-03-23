import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { AiScript, GenerateScriptParams, ViralAnalysis } from '@/types/script.d'

export const useScriptStore = defineStore('script', {
  state: () => ({
    loading: false,
    generating: false,
    error: null as string | null,
    list: [] as AiScript[],
    current: null as AiScript | null,
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
        const resp = await ApiService.v1.AiScript.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        const result = resp.data?.data ?? resp.data
        this.list = result.data ?? result
        this.total = result.total ?? this.list.length
        this.page = result.page ?? this.page
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load scripts'
      } finally {
        this.loading = false
      }
    },

    async generate(params: GenerateScriptParams) {
      this.generating = true
      this.error = null
      try {
        const resp = await ApiService.v1.AiScript.Generate(params)
        const data = resp.data?.data ?? resp.data
        this.current = data as AiScript
        // Refresh list after generating
        this.fetch()
        return data as AiScript
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to generate script'
        throw error
      } finally {
        this.generating = false
      }
    },

    async selectVariant(id: number, scriptIndex: number) {
      try {
        const resp = await ApiService.v1.AiScript.Select(id, { scriptIndex })
        const data = resp.data?.data ?? resp.data
        // Update current if it matches
        if (this.current && this.current.id === id) {
          this.current.selectedIndex = data.selectedIndex
          this.current.selectedScript = data.selectedScript
        }
        // Update in list
        const item = this.list.find((s) => s.id === id)
        if (item) {
          item.selectedIndex = data.selectedIndex
          item.selectedScript = data.selectedScript
        }
        return data
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to select variant'
        throw error
      }
    },

    async fetchViralScore(id: number) {
      try {
        const resp = await ApiService.v1.AiScript.ViralScore(id)
        const data = resp.data?.data ?? resp.data
        // Update current
        if (this.current && this.current.id === id) {
          this.current.viralScore = data.score
          this.current.viralAnalysis = data as ViralAnalysis
        }
        // Update in list
        const item = this.list.find((s) => s.id === id)
        if (item) {
          item.viralScore = data.score
          item.viralAnalysis = data as ViralAnalysis
        }
        return data as ViralAnalysis
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to get viral score'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useScriptStore, import.meta.hot)
}
