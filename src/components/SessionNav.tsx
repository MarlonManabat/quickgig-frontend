'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function SessionNav() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/session/me', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && data.user) setUser(data.user as User);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch('/api/session/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
    router.push('/');
    setTimeout(() => {
      (document.querySelector('main, h1') as HTMLElement | null)?.focus();
    }, 0);
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

  const firstName = user.name ? user.name.split(' ')[0] : null;

  return (
    <div className="flex items-center space-x-4">
      {firstName && (
        <span className="text-sm">Kumusta, {firstName}</span>
      )}
      <Link href="/profile" className="text-sm hover:underline">
        Profile
      </Link>
      <button
        onClick={logout}
        className="text-sm hover:underline"
      >
        Logout
      </button>
    </div>
  );
}
