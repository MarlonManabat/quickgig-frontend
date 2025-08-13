'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginData, SignupData, UpdateUserData } from '@/types';
import { apiFetch } from '@/lib/api';
import { saveToken, clearAuth, getToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  isAuthenticated: boolean;
  token: string | null;
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

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      } else if (token) {
        try {
          const response = await apiFetch<{ user?: User }>('/user/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            credentials: 'include',
          });
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
          }
        } catch {
          clearAuth();
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await apiFetch<{ token?: string; user?: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (response.token) saveToken(response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await apiFetch<{ token?: string; user?: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (response.token) saveToken(response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      const token = getToken();
      await apiFetch('/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
      });
    } catch {}
    clearAuth();
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      const token = getToken();
      const response = await apiFetch<{ user?: User }>('/user/update', {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const updatedUser = response.user;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Update failed');
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
    token: getToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

