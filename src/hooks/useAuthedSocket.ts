'use client';
import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { startSocket, stopSocket } from '@/lib/socket-client';
import { useAuth } from '@/context/AuthContext';

export function useAuthedSocket() {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const s = startSocket();
      setSocket(s);
      return () => stopSocket();
    }
    stopSocket();
    setSocket(null);
  }, [isAuthenticated]);

  return socket;
}
