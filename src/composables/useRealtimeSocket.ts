import { onMounted, onUnmounted } from 'vue'
import { getSocket, connectSocket, disconnectSocket } from '@/plugins/socket'
import { useRealtimeStore } from '@/stores/realtime'
import { useNotificationStore } from '@/stores/notification'
import type { Socket } from 'socket.io-client'

/**
 * Composable that manages the Socket.IO connection lifecycle.
 * Connects on mount, disconnects on unmount.
 * Auto-registers listeners for realtime events and notifications.
 */
export function useRealtimeSocket() {
  const realtimeStore = useRealtimeStore()
  const notificationStore = useNotificationStore()
  let socket: Socket | null = null

  onMounted(() => {
    connectSocket()
    socket = getSocket()
    realtimeStore.setConnected(socket.connected)

    socket.on('connect', () => {
      realtimeStore.setConnected(true)
    })

    socket.on('disconnect', () => {
      realtimeStore.setConnected(false)
    })

    // ─── Realtime events ──────────────────────────────────
    socket.on('video:progress', (data: any) => {
      realtimeStore.pushEvent({ type: 'video:progress', payload: data })
    })

    socket.on('video:complete', (data: any) => {
      realtimeStore.pushEvent({ type: 'video:complete', payload: data })
    })

    socket.on('video:failed', (data: any) => {
      realtimeStore.pushEvent({ type: 'video:failed', payload: data })
    })

    socket.on('post:published', (data: any) => {
      realtimeStore.pushEvent({ type: 'post:published', payload: data })
    })

    socket.on('post:failed', (data: any) => {
      realtimeStore.pushEvent({ type: 'post:failed', payload: data })
    })

    socket.on('presence:online', (data: any) => {
      realtimeStore.pushEvent({ type: 'presence:online', payload: data })
    })

    socket.on('presence:offline', (data: any) => {
      realtimeStore.pushEvent({ type: 'presence:offline', payload: data })
    })

    socket.on('online-users', (data: any) => {
      realtimeStore.setOnlineUsers(data.count ?? 0)
    })

    // ─── Notification events ──────────────────────────────
    socket.on('notification:new', (data: any) => {
      notificationStore.addFromSocket(data)
      realtimeStore.pushEvent({ type: 'notification:new', payload: data })
    })
  })

  onUnmounted(() => {
    disconnectSocket()
    realtimeStore.setConnected(false)
  })

  function on<T = unknown>(event: string, callback: (data: T) => void) {
    const s = getSocket()
    s.on(event, callback)

    onUnmounted(() => {
      s.off(event, callback)
    })
  }

  return { on }
}
