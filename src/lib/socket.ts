import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token?: string) {
  if (socket) return socket;
  const url =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    `${process.env.NEXT_PUBLIC_API_URL}`;
  socket = io(url, {
    path: '/socket.io',
    transports: ['websocket'],
    withCredentials: true,
    auth: token ? { token } : undefined,
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export const getSocket = () => socket;
