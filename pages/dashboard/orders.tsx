import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { TICKET_PRICE_PHP } from '@/lib/payments';
import { uploadPublicFile } from '@/lib/storage';

const GCASH_QR_URL = process.env.GCASH_QR_URL || '/assets/gcash-qr.png';

type Order = { id: number; reference: string; status: string; proof_url?: string };

export default function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/orders');
    const d = await res.json();
    setOrders(d.orders || []);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setLoading(true);
    await fetch('/api/orders', { method: 'POST' });
    setLoading(false);
    await load();
  }

  async function onFile(orderId: number, file: File) {
    const url = await uploadPublicFile(file, 'orders');
    await fetch(`/api/orders/${orderId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proof_url: url }),
    });
    await load();
  }

  return (
    <Shell>
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <p className="mb-4 text-sm">Ticket price: ₱{TICKET_PRICE_PHP}</p>
      <button
        onClick={create}
        disabled={loading}
        className="rounded bg-yellow-400 px-4 py-2 font-medium text-black disabled:opacity-50"
      >
        {loading ? 'Creating…' : 'Create Order'}
      </button>
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded border border-slate-700 p-3">
            <div>Ref: {o.reference}</div>
            <div>Status: {o.status}</div>
            {o.proof_url ? (
              <a href={o.proof_url} className="text-sm underline" target="_blank">
                Proof
              </a>
            ) : (
              <div className="mt-2 text-sm">
                <p>Send payment then upload screenshot:</p>
                <img src={GCASH_QR_URL} alt="GCash QR" className="my-2 h-32" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(o.id, f);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}

