import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;
let socket: Socket | null = null;

export function startSocket() {
  if (socket) return socket;
  socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true, withCredentials: true });
  return socket;
}

export function stopSocket() {
  socket?.disconnect();
  socket = null;
}

export const getSocket = () => socket;
