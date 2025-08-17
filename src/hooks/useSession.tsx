'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Session } from '@/types/user';

interface SessionContextValue {
  session: Session;
  loading: boolean;
  login: (email: string, password: string) => Promise<Session>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const r = await fetch('/api/session');
      const j = await r.json().catch(() => ({}));
      setSession(j.session ?? null);
    } catch {
      setSession(null);
    }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch('/api/session/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json().catch(() => ({}));
    setSession(j.session ?? null);
    return j.session ?? null;
  };

  const logout = async () => {
    await fetch('/api/session/logout', { method: 'POST' });
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, loading, login, logout, refresh }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
