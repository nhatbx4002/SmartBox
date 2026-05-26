import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

function getSocketUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

export function getSocket(): Socket {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket(token: string) {
  const s = getSocket()
  s.auth = { token }
  s.connect()
  return s
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
