import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { User } from '@/types/auth.d'

export const useUserManagementStore = defineStore('userManagement', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as User[],
    current: null as User | null,
    // Pagination
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
    activeUsers: (state) => state.list.filter((u) => u.isActive),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number; role?: string }) {
      this.loading = true
      this.error = null
      try {
        // TODO: map paginated response to list and total
        const resp = await ApiService.v1.Users.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          role: params?.role,
        })
        this.list = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load users'
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: number) {
      try {
        // TODO: set current user from API response
        const resp = await ApiService.v1.Users.GetById(id)
        this.current = resp.data
        return resp.data as User
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load user'
        throw error
      }
    },

    async create(data: Partial<User> & { password: string }) {
      try {
        // TODO: append new user to list after creation
        const resp = await ApiService.v1.Users.Create(data)
        this.list.unshift(resp.data)
        this.total += 1
        return resp.data as User
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to create user'
        throw error
      }
    },

    async update(id: number, data: Partial<User>) {
      try {
        // TODO: update user in list in-place
        const resp = await ApiService.v1.Users.Update(id, data)
        const index = this.list.findIndex((u) => u.id === id)
        if (index !== -1) this.list[index] = resp.data
        return resp.data as User
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to update user'
        throw error
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.Users.Delete(id)
        this.list = this.list.filter((u) => u.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete user'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useUserManagementStore, import.meta.hot)
}
