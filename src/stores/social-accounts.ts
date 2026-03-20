import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { SocialAccount, AnalyticsSnapshot } from '@/types/social.d'

export const useSocialAccountsStore = defineStore('socialAccounts', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as SocialAccount[],
    analytics: {} as Record<number, AnalyticsSnapshot[]>,
    // Pagination
    page: 1,
    limit: 50,
    total: 0,
  }),

  getters: {
    activeAccounts: (state) => state.list.filter((a) => a.isActive),
    totalPages: (state) => Math.ceil(state.total / state.limit),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number }) {
      this.loading = true
      this.error = null
      try {
        // TODO: map paginated response to list and total
        const resp = await ApiService.v1.SocialAccounts.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
        })
        this.list = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load social accounts'
      } finally {
        this.loading = false
      }
    },

    async create(data: Partial<SocialAccount>) {
      try {
        // TODO: append new account to list after creation
        const resp = await ApiService.v1.SocialAccounts.Create(data)
        this.list.push(resp.data)
        this.total += 1
        return resp.data as SocialAccount
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to create social account'
        throw error
      }
    },

    async update(id: number, data: Partial<SocialAccount>) {
      try {
        // TODO: update item in list in-place
        const resp = await ApiService.v1.SocialAccounts.Update(id, data)
        const index = this.list.findIndex((a) => a.id === id)
        if (index !== -1) this.list[index] = resp.data
        return resp.data as SocialAccount
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to update social account'
        throw error
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.SocialAccounts.Delete(id)
        this.list = this.list.filter((a) => a.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete social account'
        throw error
      }
    },

    async sync(id: number) {
      try {
        // TODO: update lastSyncAt on the account after sync
        await ApiService.v1.SocialAccounts.Sync(id)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to sync social account'
        throw error
      }
    },

    async fetchAnalytics(id: number, params?: any) {
      try {
        // TODO: cache analytics by accountId
        const resp = await ApiService.v1.SocialAccounts.Analytics(id, params)
        this.analytics[id] = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load analytics'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useSocialAccountsStore, import.meta.hot)
}
