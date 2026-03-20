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
    // Pagination
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
        // TODO: map paginated response to list and total
        const resp = await ApiService.v1.AiVideo.Jobs({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        this.list = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load video jobs'
      } finally {
        this.loading = false
      }
    },

    async fetchStyles() {
      try {
        // TODO: map styles response
        const resp = await ApiService.v1.AiVideo.Styles()
        this.styles = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load video styles'
      }
    },

    async generate(params: GenerateVideoParams) {
      this.generating = true
      this.error = null
      try {
        // TODO: optimistically add job to list with queued status
        const resp = await ApiService.v1.AiVideo.Generate(params)
        this.current = resp.data
        return resp.data as VideoJob
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to generate video'
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
        this.error = error?.message ?? 'Failed to delete video job'
        throw error
      }
    },

    updateJobProgress(id: number, progress: number) {
      // Called via socket event to update job progress in-place
      const job = this.list.find((j) => j.id === id)
      if (job) {
        job.progress = progress
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useVideoStore, import.meta.hot)
}
