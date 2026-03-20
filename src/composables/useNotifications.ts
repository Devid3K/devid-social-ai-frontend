import { computed, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'

/**
 * Composable for managing app notifications.
 * Fetches on mount and exposes reactive state + actions.
 */
export function useNotifications() {
  const store = useNotificationStore()

  const notifications = computed(() => store.list)
  const unreadCount = computed(() => store.unreadCount)
  const hasUnread = computed(() => store.hasUnread)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  onMounted(() => {
    store.fetch()
  })

  async function markRead(id: number) {
    await store.markRead(id)
  }

  async function markAllRead() {
    await store.markAllRead()
  }

  async function remove(id: number) {
    await store.delete(id)
  }

  async function refresh() {
    await store.fetch()
  }

  return {
    notifications,
    unreadCount,
    hasUnread,
    loading,
    error,
    markRead,
    markAllRead,
    remove,
    refresh,
  }
}
