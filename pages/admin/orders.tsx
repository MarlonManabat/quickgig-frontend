import { GetServerSideProps } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supa = createServerSupabaseClient(ctx);
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return { redirect: { destination: '/', permanent: false } };
  const { data: me } = await supa.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return { redirect: { destination: '/', permanent: false } };

  const { data: orders } = await supa.from('orders').select('*').order('created_at', { ascending: false });
  return { props: { orders: orders ?? [] } };
};

export default function AdminOrders({ orders }: { orders: any[] }) {
  const [busy, setBusy] = React.useState<string | null>(null);

  const approve = async (id: string) => {
    setBusy(id);
    const res = await fetch('/api/orders/approve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: id })
    });
    setBusy(null);
    if (!res.ok) return alert('Approve failed');
    location.reload();
  };

  const viewProof = async (path: string) => {
    const res = await fetch('/api/orders/proof-url', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ path })
    });
    if (!res.ok) return alert('Cannot open proof');
    const { url } = await res.json();
    window.open(url, '_blank');
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <ul className="space-y-3">
        {orders.map(o => (
          <li key={o.id} className="border rounded-xl p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{o.status.toUpperCase()} • ₱{o.amount} • {o.credits} credits</div>
              <div className="text-sm opacity-70">{new Date(o.created_at).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              {o.proof_path && <button className="px-3 py-2 rounded-xl border" onClick={()=>viewProof(o.proof_path)}>View proof</button>}
              {o.status === 'pending' &&
                <button className="px-3 py-2 rounded-xl bg-black text-white" disabled={busy===o.id} onClick={()=>approve(o.id)}>
                  {busy===o.id ? 'Approving…' : 'Approve'}
                </button>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
