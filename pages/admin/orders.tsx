import { GetServerSideProps } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

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
  const approve = async (id: string) => {
    const res = await fetch('/api/orders/approve', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ order_id: id })
    });
    if (!res.ok) return alert('Approve failed');
    location.reload();
  };
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <ul className="space-y-3">
        {orders.map(o => (
          <li key={o.id} className="border rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{o.status.toUpperCase()} • ₱{o.amount} • {o.credits} credits</div>
                <div className="text-sm opacity-70">{o.user_id}</div>
              </div>
              {o.status === 'pending' && (
                <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={()=>approve(o.id)}>
                  Approve
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

