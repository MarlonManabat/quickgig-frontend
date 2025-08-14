'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getApiBase } from '@/lib/api';

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
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token && user) {
      // Initialize socket connection
      const newSocket = io(getApiBase(), {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Clean up socket if user is not authenticated
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, token, user, socket]);

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

