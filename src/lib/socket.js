// Socket.io client service for Casal Investigador multiplayer
import { io } from 'socket.io-client'

// Change this to your server URL (e.g. 'https://your-server.onrender.com')
const SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(SERVER_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) s.connect()
  return s
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export { SERVER_URL }
