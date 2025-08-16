'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatRoomId: string) => void;
  leaveChat: (chatRoomId: string) => void;
  sendMessage: (chatRoomId: string, message: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let active = true;
    let localSocket: Socket | null = null;
    getSocket().then((s) => {
      if (!active || !s) return;
      localSocket = s;
      setSocket(s);
      setIsConnected(s.connected);
      s.on('connect', () => setIsConnected(true));
      s.on('disconnect', () => setIsConnected(false));
    });
    return () => {
      active = false;
      localSocket?.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const joinChat = (chatRoomId: string) => {
    if (socket && isConnected) {
      socket.emit('join_chat', chatRoomId);
    }
  };

  const leaveChat = (chatRoomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_chat', chatRoomId);
    }
  };

  const sendMessage = (chatRoomId: string, message: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', { chatRoomId, message });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

