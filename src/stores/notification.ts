import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { Notification } from '@/types/notification.d'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as Notification[],
  }),

  getters: {
    unreadCount: (state) => state.list.filter((n) => !n.isRead).length,
    hasUnread: (state) => state.list.some((n) => !n.isRead),
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        // TODO: map API response to notification list
        const resp = await ApiService.v1.Notifications.List()
        this.list = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load notifications'
      } finally {
        this.loading = false
      }
    },

    async markRead(id: number) {
      try {
        await ApiService.v1.Notifications.MarkRead(id)
        const notification = this.list.find((n) => n.id === id)
        if (notification) notification.isRead = true
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to mark notification as read'
        throw error
      }
    },

    async markAllRead() {
      try {
        await ApiService.v1.Notifications.MarkAllRead()
        this.list.forEach((n) => {
          n.isRead = true
        })
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to mark all notifications as read'
        throw error
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.Notifications.Delete(id)
        this.list = this.list.filter((n) => n.id !== id)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete notification'
        throw error
      }
    },

    addFromSocket(notification: Notification) {
      // Called via socket event when new notification arrives
      this.list.unshift(notification)
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useNotificationStore, import.meta.hot)
}
