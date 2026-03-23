import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { Post, CreatePostParams, SchedulePostParams, PostPerformance } from '@/types/post.d'

export const usePostStore = defineStore('post', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as Post[],
    current: null as Post | null,
    performance: null as PostPerformance | null,
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
    scheduledPosts: (state) => state.list.filter((p) => p.status === 'scheduled'),
    draftPosts: (state) => state.list.filter((p) => p.status === 'draft'),
    publishedPosts: (state) => state.list.filter((p) => p.status === 'published'),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number; status?: string }) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Posts.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          status: params?.status,
        })
        const payload = resp.data?.data ?? resp.data
        this.list = payload.data ?? payload
        this.total = payload.total ?? this.list.length
        this.page = payload.page ?? params?.page ?? this.page
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ไม่สามารถโหลดรายการโพสต์ได้'
      } finally {
        this.loading = false
      }
    },

    async create(data: CreatePostParams) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Posts.Create(data)
        const post = resp.data?.data ?? resp.data
        this.list.unshift(post)
        this.total += 1
        this.current = post
        return post as Post
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'สร้างโพสต์ไม่สำเร็จ'
        throw error
      } finally {
        this.loading = false
      }
    },

    async update(id: number, data: Partial<CreatePostParams>) {
      this.error = null
      try {
        const resp = await ApiService.v1.Posts.Update(id, data)
        const post = resp.data?.data ?? resp.data
        const index = this.list.findIndex((p) => p.id === id)
        if (index !== -1) this.list[index] = post
        return post as Post
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'แก้ไขโพสต์ไม่สำเร็จ'
        throw error
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.Posts.Delete(id)
        this.list = this.list.filter((p) => p.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ลบโพสต์ไม่สำเร็จ'
        throw error
      }
    },

    async publish(id: number) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Posts.Publish(id)
        const post = resp.data?.data ?? resp.data
        const index = this.list.findIndex((p) => p.id === id)
        if (index !== -1) this.list[index] = post
        return post as Post
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'โพสต์ไม่สำเร็จ'
        throw error
      } finally {
        this.loading = false
      }
    },

    async schedule(id: number, data: SchedulePostParams) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Posts.Schedule(id, data)
        const post = resp.data?.data ?? resp.data
        const index = this.list.findIndex((p) => p.id === id)
        if (index !== -1) this.list[index] = post
        return post as Post
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ตั้งเวลาโพสต์ไม่สำเร็จ'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPerformance(id: number) {
      this.loading = true
      try {
        const resp = await ApiService.v1.Posts.Performance(id)
        this.performance = resp.data?.data ?? resp.data
        return this.performance
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'โหลดสถิติไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(usePostStore, import.meta.hot)
}
