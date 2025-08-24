'use client';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/AdminTable';
import { listUsers, suspendUser, unsuspendUser, purgeUserContent } from '@/lib/admin';

export default function AdminUsers() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');

  const load = async () => {
    const { data } = await listUsers({ q });
    setRows(data || []);
  };

  useEffect(() => {
    load();
  }, [q]);

  const handleSuspend = async (id: string) => {
    await suspendUser(id);
    await load();
  };

  const handleUnsuspend = async (id: string) => {
    await unsuspendUser(id);
    await load();
  };

  const handlePurge = async (id: string) => {
    const days = Number(process.env.ACCOUNT_RETENTION_DAYS ?? 30);
    await purgeUserContent(id, days);
    await load();
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search email..."
        className="border p-2 mb-4 w-full"
      />
      <AdminTable>
        <thead>
          <tr className="text-left">
            <th>Email</th>
            <th>Role</th>
            <th>Suspended</th>
            <th>Delete requested</th>
            <th>Deleted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-t">
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.suspended_at ? 'yes' : 'no'}</td>
              <td>{u.delete_requested_at ? new Date(u.delete_requested_at).toLocaleString() : ''}</td>
              <td>{u.deleted_at ? new Date(u.deleted_at).toLocaleString() : ''}</td>
              <td>
                {u.deleted_at && (
                  <button
                    onClick={() => handlePurge(u.id)}
                    data-testid="admin-purge-user"
                    className="underline text-sm mr-2"
                  >
                    Purge content now
                  </button>
                )}
                {u.suspended_at ? (
                  <button
                    onClick={() => handleUnsuspend(u.id)}
                    data-testid="admin-unsuspend-user"
                    className="underline text-sm"
                  >
                    Unsuspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleSuspend(u.id)}
                    data-testid="admin-suspend-user"
                    className="underline text-sm"
                  >
                    Suspend
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </main>
  );
}
