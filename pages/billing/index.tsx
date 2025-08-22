'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { uploadPaymentProof } from '@/utils/uploadProof';

export default function Billing() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);
  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setOrders(data || []));
  }, [user]);

  async function createOrUpdate() {
    if (!user || !file) return;
    setSubmitting(true);
    try {
      const proofUrl = await uploadPaymentProof(user.id, file);
      // create a new pending order with proof
      const { error } = await supabase.from('orders').insert({
        user_id: user.id, amount: 0, currency: 'PHP', status: 'pending', proof_url: proofUrl, method: 'gcash'
      });
      if (error) throw error;
      const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setOrders(data || []);
      setFile(null);
    } catch (e) { console.error(e); }
    setSubmitting(false);
  }

  const requirePayment = process.env.NEXT_PUBLIC_REQUIRE_PAYMENT === 'true';

  return (
    <main className="max-w-2xl mx-auto p-6" data-testid="billing-page">
      <h1 className="text-xl font-semibold mb-4">Billing (Manual GCash)</h1>

      {requirePayment ? (
        <>
          <p className="mb-4">To post jobs, upload your GCash proof. An admin will review it.</p>
          <div className="mb-6 flex items-center gap-3">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button className="btn-primary px-4 py-2 rounded" disabled={!file || submitting} onClick={createOrUpdate} data-testid="upload-proof">
              {submitting ? 'Submitting…' : 'Upload proof'}
            </button>
          </div>
          <section>
            <h2 className="font-medium mb-2">Your submissions</h2>
            <ul data-testid="orders-list" className="space-y-2">
              {orders.map(o => (
                <li key={o.id} className="border rounded p-3">
                  <div>Status: <b data-testid="order-status">{o.status}</b></div>
                  {o.proof_url && <a href={o.proof_url} target="_blank" rel="noreferrer">View proof</a>}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p className="text-green-700">Payment gating is disabled; you can post jobs.</p>
      )}
    </main>
  );
}
