'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { useAuthedSocket } from '@/hooks/useAuthedSocket';

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
  const socket = useAuthedSocket();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      setIsConnected(false);
      return;
    }
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

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

