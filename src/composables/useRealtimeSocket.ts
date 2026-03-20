import { onMounted, onUnmounted } from 'vue'
import { getSocket, connectSocket, disconnectSocket } from '@/plugins/socket'
import { useRealtimeStore } from '@/stores/realtime'
import type { Socket } from 'socket.io-client'

/**
 * Composable that manages the Socket.IO connection lifecycle.
 * Connects on mount, disconnects on unmount.
 * Exposes an `on` helper to register event listeners cleanly.
 */
export function useRealtimeSocket() {
  const store = useRealtimeStore()
  let socket: Socket | null = null

  onMounted(() => {
    connectSocket()
    socket = getSocket()
    store.setConnected(socket.connected)

    socket.on('connect', () => {
      store.setConnected(true)
    })

    socket.on('disconnect', () => {
      store.setConnected(false)
    })
  })

  onUnmounted(() => {
    disconnectSocket()
    store.setConnected(false)
  })

  /**
   * Register a listener for a socket event.
   * The listener is automatically removed when the component unmounts.
   */
  function on<T = unknown>(event: string, callback: (data: T) => void) {
    const s = getSocket()
    s.on(event, callback)

    onUnmounted(() => {
      s.off(event, callback)
    })
  }

  return {
    on,
  }
}
