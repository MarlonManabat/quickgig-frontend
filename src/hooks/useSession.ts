'use client';
import { useState, useEffect } from 'react';

interface SessionUser {
  isEmployer?: boolean;
  role?: string;
  email?: string;
  ticketBalance?: number;
  name?: string;
  [key: string]: unknown;
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/session/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: unknown) => {
        const obj = data as Record<string, unknown>;
        setUser((obj.user as SessionUser) ?? (obj as SessionUser));
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
