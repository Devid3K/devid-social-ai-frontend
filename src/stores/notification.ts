import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { Notification } from '@/types/notification.d'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as Notification[],
    unreadTotal: 0,
  }),

  getters: {
    unreadCount: (state) => state.unreadTotal,
    hasUnread: (state) => state.unreadTotal > 0,
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Notifications.List()
        const payload = resp.data?.data ?? resp.data
        this.list = payload.data ?? payload
        this.unreadTotal = payload.unreadCount ?? this.list.filter((n: Notification) => !n.isRead).length
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'โหลดการแจ้งเตือนไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },

    async markRead(id: number) {
      try {
        await ApiService.v1.Notifications.MarkRead(id)
        const notification = this.list.find((n) => n.id === id)
        if (notification && !notification.isRead) {
          notification.isRead = true
          this.unreadTotal = Math.max(0, this.unreadTotal - 1)
        }
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ทำเครื่องหมายไม่สำเร็จ'
        throw error
      }
    },

    async markAllRead() {
      try {
        await ApiService.v1.Notifications.MarkAllRead()
        this.list.forEach((n) => { n.isRead = true })
        this.unreadTotal = 0
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ทำเครื่องหมายทั้งหมดไม่สำเร็จ'
        throw error
      }
    },

    async delete(id: number) {
      try {
        const notification = this.list.find((n) => n.id === id)
        await ApiService.v1.Notifications.Delete(id)
        this.list = this.list.filter((n) => n.id !== id)
        if (notification && !notification.isRead) {
          this.unreadTotal = Math.max(0, this.unreadTotal - 1)
        }
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ลบการแจ้งเตือนไม่สำเร็จ'
        throw error
      }
    },

    addFromSocket(notification: Notification) {
      this.list.unshift(notification)
      if (!notification.isRead) {
        this.unreadTotal += 1
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useNotificationStore, import.meta.hot)
}
