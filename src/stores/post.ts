import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { Post, CreatePostParams, SchedulePostParams } from '@/types/post.d'

export const usePostStore = defineStore('post', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as Post[],
    current: null as Post | null,
    // Pagination
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
    scheduledPosts: (state) => state.list.filter((p) => p.status === 'scheduled'),
    draftPosts: (state) => state.list.filter((p) => p.status === 'draft'),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number; status?: string }) {
      this.loading = true
      this.error = null
      try {
        // TODO: map paginated response to list and total
        const resp = await ApiService.v1.Posts.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          status: params?.status,
        })
        this.list = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load posts'
      } finally {
        this.loading = false
      }
    },

    async create(data: CreatePostParams) {
      this.loading = true
      this.error = null
      try {
        // TODO: append new post to list after creation
        const resp = await ApiService.v1.Posts.Create(data)
        this.list.unshift(resp.data)
        this.total += 1
        this.current = resp.data
        return resp.data as Post
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to create post'
        throw error
      } finally {
        this.loading = false
      }
    },

    async update(id: number, data: Partial<Post>) {
      try {
        // TODO: update item in list in-place
        const resp = await ApiService.v1.Posts.Update(id, data)
        const index = this.list.findIndex((p) => p.id === id)
        if (index !== -1) this.list[index] = resp.data
        return resp.data as Post
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to update post'
        throw error
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.Posts.Delete(id)
        this.list = this.list.filter((p) => p.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete post'
        throw error
      }
    },

    async publish(id: number) {
      try {
        // TODO: update post status to published in list
        const resp = await ApiService.v1.Posts.Publish(id)
        const index = this.list.findIndex((p) => p.id === id)
        if (index !== -1) this.list[index] = resp.data
        return resp.data as Post
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to publish post'
        throw error
      }
    },

    async schedule(id: number, data: SchedulePostParams) {
      try {
        // TODO: update post status to scheduled in list
        const resp = await ApiService.v1.Posts.Schedule(id, data)
        const index = this.list.findIndex((p) => p.id === id)
        if (index !== -1) this.list[index] = resp.data
        return resp.data as Post
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to schedule post'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(usePostStore, import.meta.hot)
}
