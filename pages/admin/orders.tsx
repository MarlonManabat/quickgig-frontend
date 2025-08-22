'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function OrdersAdmin() {
  const [user, setUser] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);
  useEffect(() => {
    if (!user) return;
    // naive “admin” check; hide if not admin
    (async () => {
      const { data: prof } = await supabase.from('profiles').select('admin').eq('id', user.id).single();
      if (!prof?.admin) return;
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setRows(data || []);
    })();
  }, [user]);

  async function setStatus(id: string, status: 'approved' | 'rejected') {
    await supabase.from('orders').update({ status }).eq('id', id);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setRows(data || []);
  }

  if (!rows.length) return <main className="p-6">No orders or no access.</main>;

  return (
    <main className="max-w-3xl mx-auto p-6" data-testid="orders-admin">
      <h1 className="text-xl font-semibold mb-4">Review orders</h1>
      <ul className="space-y-3">
        {rows.map(o => (
          <li key={o.id} className="border rounded p-3 flex gap-3 justify-between items-center">
            <div>
              <div><b>{o.currency} {o.amount}</b> — <span data-testid="order-status">{o.status}</span></div>
              {o.proof_url && <a href={o.proof_url} target="_blank" rel="noreferrer">Proof</a>}
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary px-3 py-1 rounded" onClick={() => setStatus(o.id, 'rejected')} data-testid="admin-reject">Reject</button>
              <button className="btn-primary px-3 py-1 rounded" onClick={() => setStatus(o.id, 'approved')} data-testid="admin-approve">Approve</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
