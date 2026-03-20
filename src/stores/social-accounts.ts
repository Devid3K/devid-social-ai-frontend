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
    async fetch(params?: { page?: number; limit?: number; platform?: string }) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.SocialAccounts.List({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          platform: params?.platform,
        })
        const data = resp.data?.data ?? resp.data
        this.list = Array.isArray(data) ? data : []
        this.total = resp.data?.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load social accounts'
      } finally {
        this.loading = false
      }
    },

    async create(data: Partial<SocialAccount>) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.SocialAccounts.Create(data)
        const account = resp.data?.data ?? resp.data
        this.list.push(account)
        this.total += 1
        return account as SocialAccount
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to create social account'
        throw error
      } finally {
        this.loading = false
      }
    },

    async update(id: number, data: Partial<SocialAccount>) {
      this.error = null
      try {
        const resp = await ApiService.v1.SocialAccounts.Update(id, data)
        const updated = resp.data?.data ?? resp.data
        const index = this.list.findIndex((a) => a.id === id)
        if (index !== -1) this.list[index] = updated
        return updated as SocialAccount
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to update social account'
        throw error
      }
    },

    async delete(id: number) {
      this.error = null
      try {
        await ApiService.v1.SocialAccounts.Delete(id)
        this.list = this.list.filter((a) => a.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to delete social account'
        throw error
      }
    },

    async sync(id: number) {
      this.error = null
      try {
        const resp = await ApiService.v1.SocialAccounts.Sync(id)
        // Update lastSyncAt on the account locally
        const index = this.list.findIndex((a) => a.id === id)
        if (index !== -1) {
          const updated = resp.data?.data ?? resp.data
          if (updated && typeof updated === 'object' && updated.id) {
            this.list[index] = updated
          } else {
            this.list[index] = {
              ...this.list[index],
              lastSyncAt: new Date().toISOString(),
            }
          }
        }
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to sync social account'
        throw error
      }
    },

    async fetchAnalytics(id: number, params?: { from?: string; to?: string }) {
      this.error = null
      try {
        const resp = await ApiService.v1.SocialAccounts.Analytics(id, params)
        const data = resp.data?.data ?? resp.data
        this.analytics[id] = Array.isArray(data) ? data : []
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'Failed to load analytics'
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useSocialAccountsStore, import.meta.hot)
}
