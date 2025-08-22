import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { supabase } from '@/utils/supabaseClient';
import { isAdmin } from '@/lib/auth';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (isAdmin(data.user?.email)) {
        setAllowed(true);
        const res = await fetch('/api/orders');
        const d = await res.json();
        setOrders(d.orders || []);
      } else {
        setAllowed(false);
      }
    });
  }, []);

  async function decide(id: number, decision: 'paid' | 'rejected') {
    await fetch(`/api/orders/${id}/decide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision }) });
    const res = await fetch('/api/orders');
    const d = await res.json();
    setOrders(d.orders || []);
  }

  if (allowed === null) return <Shell><p>Loading…</p></Shell>;
  if (!allowed) return <Shell><p>Forbidden</p></Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <table className="w-full text-sm">
        <thead>
          <tr><th className="text-left">Ref</th><th>User</th><th>Proof</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t border-brand-border">
              <td>{o.reference}</td>
              <td>{o.user?.email}</td>
              <td>{o.proof_url && <a href={o.proof_url} className="underline">Link</a>}</td>
              <td>{o.status}</td>
              <td className="space-x-2">
                <button onClick={()=>decide(o.id,'paid')} className="text-brand-success">Approve</button>
                <button onClick={()=>decide(o.id,'rejected')} className="text-brand-danger">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
