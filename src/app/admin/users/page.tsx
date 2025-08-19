'use client';

import { useEffect, useState } from 'react';
import { API } from '@/config/api';
import { toast } from '@/lib/toast';
import { apiGet, apiPost } from '@/lib/api';

interface UserRow {
  id: string | number;
  name: string;
  email: string;
  status?: string;
  joined?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('active');

  const load = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    apiGet<{ users?: UserRow[] }>(`${API.adminUsersList}?${params.toString()}`)
      .then((d) => setUsers(d.users || (d as unknown as UserRow[])))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const notify = (to?: string, subject = '', html = '') => {
    if (!to) return;
    fetch('/api/notify/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail: to, subject, html }),
    }).catch(() => {});
  };

  const ban = async (id: string | number) => {
    const reason = prompt('Reason (optional)') || '';
    const data = await apiPost<{ email?: string }>(API.adminUserBan(id), { reason }).catch(() => ({}) as { email?: string });
    notify(data.email, 'Account banned', 'Your account was banned.');
    toast('User banned');
    load();
  };

  const unban = async (id: string | number) => {
    const data = await apiPost<{ email?: string }>(API.adminUserUnban(id), {}).catch(() => ({}) as { email?: string });
    notify(data.email, 'Account unbanned', 'Your account was unbanned.');
    toast('User unbanned');
    load();
  };

  if (!users) return <main className="p-4">Loading...</main>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Users</h1>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="border px-2 py-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
        <button onClick={load} className="px-3 py-1 border rounded">
          Go
        </button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1 text-left">Email</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.name}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">{u.status}</td>
              <td className="border px-2 py-1 space-x-2">
                {u.status === 'banned' ? (
                  <button onClick={() => unban(u.id)} className="text-green-600">
                    Unban
                  </button>
                ) : (
                  <button onClick={() => ban(u.id)} className="text-red-600">
                    Ban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

