import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { VideoJob, VideoStyle, GenerateVideoParams } from '@/types/video.d'

export const useVideoStore = defineStore('video', {
  state: () => ({
    loading: false,
    generating: false,
    error: null as string | null,
    list: [] as VideoJob[],
    current: null as VideoJob | null,
    styles: [] as VideoStyle[],
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
    pendingJobs: (state) =>
      state.list.filter((j) => j.status === 'queued' || j.status === 'processing'),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number }) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.AiVideo.Jobs({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        const result = resp.data?.data ?? resp.data
        this.list = result.data ?? result
        this.total = result.total ?? this.list.length
        this.page = result.page ?? this.page
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load video jobs'
      } finally {
        this.loading = false
      }
    },

    async fetchStyles() {
      try {
        const resp = await ApiService.v1.AiVideo.Styles()
        this.styles = resp.data?.data ?? resp.data
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load video styles'
      }
    },

    async generate(params: GenerateVideoParams) {
      this.generating = true
      this.error = null
      try {
        const resp = await ApiService.v1.AiVideo.Generate(params)
        const data = resp.data?.data ?? resp.data
        this.current = data as VideoJob
        // Refresh list
        this.fetch()
        return data as VideoJob
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to generate video'
        throw error
      } finally {
        this.generating = false
      }
    },

    async deleteJob(id: number) {
      try {
        await ApiService.v1.AiVideo.DeleteJob(id)
        this.list = this.list.filter((j) => j.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to delete job'
        throw error
      }
    },

    updateJobProgress(id: number, progress: number) {
      const job = this.list.find((j) => j.id === id)
      if (job) {
        job.progress = progress
      }
    },

    updateJobCompleted(id: number, videoUrl: string, thumbnailUrl?: string) {
      const job = this.list.find((j) => j.id === id)
      if (job) {
        job.status = 'completed' as any
        job.progress = 100
        job.videoUrl = videoUrl
        job.thumbnailUrl = thumbnailUrl ?? null
      }
    },

    updateJobFailed(id: number, errorMessage: string) {
      const job = this.list.find((j) => j.id === id)
      if (job) {
        job.status = 'failed' as any
        job.progress = 0
        job.errorMessage = errorMessage
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useVideoStore, import.meta.hot)
}
