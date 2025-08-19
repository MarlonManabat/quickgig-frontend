'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { API } from '@/config/api';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';
import { apiPost } from '@/lib/api';

export default function AccountSettingsPage() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost(API.changePassword, { current, next });
      toast('Password changed');
      setCurrent('');
      setNext('');
    } catch {
      toast('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await apiPost('/auth/logoutAll.php', {});
      toast('Logged out of all devices');
    } catch {
      toast('Failed to log out');
    }
  };

  return (
    <main className="p-4 space-y-6 max-w-md">
      <h1 className="text-xl font-semibold">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          label="Current Password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
        <Input
          type="password"
          label="New Password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Change Password'}
        </Button>
      </form>
      <Link href="/reset" className="text-qg-accent">
        Request password reset
      </Link>
      {env.NEXT_PUBLIC_SHOW_LOGOUT_ALL && (
        <Button variant="secondary" onClick={handleLogoutAll}>
          Log out of all devices
        </Button>
      )}
    </main>
  );
}
