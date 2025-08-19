'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { startSocket, stopSocket } from '@/lib/socket';

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
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      stopSocket();
      setSocket(null);
      setIsConnected(false);
      return;
    }
    const s = startSocket();
    setSocket(s);
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, [user]);

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

