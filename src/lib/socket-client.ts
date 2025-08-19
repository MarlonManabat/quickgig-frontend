'use client';

import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

let socket: Socket | null = null;

export function startSocket() {
  if (socket) return socket;
  if (typeof window === 'undefined') return null;
  if (!env.NEXT_PUBLIC_SOCKET_URL) return null;

  socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: true,
  });
  return socket;
}

export function stopSocket() {
  try {
    socket?.disconnect();
  } catch {}
  socket = null;
}

