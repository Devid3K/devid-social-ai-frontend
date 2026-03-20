import { io, Socket } from 'socket.io-client'
import { SOCKET_URL } from '@/constants/api'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const token = JSON.parse(localStorage.getItem('token') || 'null')
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) s.connect()
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect()
    socket = null
  }
}
