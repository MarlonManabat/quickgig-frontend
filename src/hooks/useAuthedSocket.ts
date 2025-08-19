'use client';
import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';

export function useAuthedSocket() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      setSocket(connectSocket());
      return () => {
        disconnectSocket();
      };
    }
    disconnectSocket();
    setSocket(null);
  }, [user]);

  return socket;
}
