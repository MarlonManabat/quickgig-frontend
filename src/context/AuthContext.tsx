'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginData, SignupData, UpdateUserData } from '@/types';
import { login as loginApi, register as registerApi, me as meApi } from '@/lib/auth';
import { api } from '@/config/api';
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
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const data = await meApi();
      const userData = (data.user || data) as User;
      if (userData && Object.keys(userData).length) setUser(userData);
      else setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  const login = async (data: LoginData) => {
    await loginApi({ email: data.email, password: data.password });
    await fetchMe();
  };

  const signup = async (data: SignupData) => {
    await registerApi({ email: data.email, password: data.password, name: data.name });
    await fetchMe();
  };

  const logout = async () => {
    await fetch(api.session.logout, { method: 'POST' });
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
