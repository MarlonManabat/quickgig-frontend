'use client';

import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

let socket: Socket | null = null;

export function startSocket() {
  if (socket) return socket;
  if (typeof window === 'undefined') return null;
  if (!env.socketUrl) return null;

  socket = io(env.socketUrl, {
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

