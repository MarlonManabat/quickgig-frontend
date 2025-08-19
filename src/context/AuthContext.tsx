'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginData, SignupData, UpdateUserData } from '@/types';
import { apiLogin, apiRegister, apiMe, apiLogout } from '@/lib/auth-client';
import { startSocket, stopSocket } from '@/lib/socket';
import { apiPut } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  hasSession?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, hasSession = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const data = await apiMe();
      const userData = (data?.user || data) as User;
      if (userData && Object.keys(userData).length) setUser(userData);
      else setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (!hasSession) { setLoading(false); return; }
    fetchMe().finally(() => setLoading(false));
  }, [hasSession]);

  const login = async (data: LoginData) => {
    await apiLogin({ identifier: data.email, password: data.password });
    await fetchMe();
    startSocket();
  };

  const signup = async (data: SignupData) => {
    await apiRegister({ name: data.name, email: data.email, password: data.password });
    await fetchMe();
    startSocket();
  };

  const logout = async () => {
    await apiLogout();
    stopSocket();
    setUser(null);
  };

  const updateUser = async (data: UpdateUserData) => {
    const res = await apiPut<{ user?: User }>("/user/update", data);
    if (res.user) {
      setUser(res.user);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    refresh: fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
