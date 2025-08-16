import { io, Socket } from 'socket.io-client';
import { ENABLE_SOCKETS, IS_LEGACY_ROUTE } from '@/env/runtime';
import { fetchSession } from '@/lib/session';

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket | null> {
  if (!ENABLE_SOCKETS) return null;
  if (IS_LEGACY_ROUTE()) return null; // marketing pages never open sockets
  if (socket) return socket;

  const session = await fetchSession();
  if (!session.ok) return null; // only connect when logged in

  // Same-origin endpoint expected (proxy on server if needed)
  socket = io('/', {
    path: '/socket.io',
    withCredentials: true,
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect_error', () => {
    // Don’t spam console; fail closed
    try { socket?.close(); } catch {}
    socket = null;
  });

  return socket;
}
