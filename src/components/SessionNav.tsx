'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IS_LEGACY_ROUTE } from '@/env/runtime';
import { fetchSession } from '@/lib/session';

interface User {
  email: string;
  name?: string;
}

export default function SessionNav() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (IS_LEGACY_ROUTE()) return;
    fetchSession().then((res) => {
      if (res.ok && res.user) setUser(res.user as User);
    });
  }, []);

  const logout = async () => {
    await fetch('/api/session/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
    router.refresh();
    setUser(null);
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm hover:underline">
          Login
        </Link>
        <Link href="/register" className="text-sm hover:underline">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/profile" className="text-sm hover:underline">
        Profile
      </Link>
      <button onClick={logout} className="text-sm hover:underline">
        Logout
      </button>
    </div>
  );
}
