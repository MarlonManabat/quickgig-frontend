import { useState } from 'react';
import Shell from '@/components/Shell';
import { TICKET_PRICE_PHP } from '@/lib/payments';

export default function CheckoutPage() {
  const [order, setOrder] = useState<{id:number, reference:string} | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function createOrder() {
    const res = await fetch('/api/orders', { method: 'POST' });
    const data = await res.json();
    if (res.ok) setOrder(data);
    else setMsg(data.error);
  }

  async function submitProof(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    const res = await fetch(`/api/orders/${order.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proof_url: proofUrl })
    });
    const data = await res.json();
    if (res.ok) setMsg('Submitted!');
    else setMsg(data.error);
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Buy Ticket</h1>
      <p className="mb-4">Send ₱{TICKET_PRICE_PHP} via GCash then upload the proof.</p>
      <img
        src={process.env.GCASH_QR_URL || '/assets/gcash-qr.png'}
        alt="GCash QR"
        loading="lazy"
        className="max-w-xs mb-4"
      />
      {!order ? (
        <button onClick={createOrder} className="btn-primary">Create Order</button>
      ) : (
        <form onSubmit={submitProof} className="space-y-3 max-w-md">
          <p>Reference: <span className="font-mono">{order.reference}</span></p>
          <input className="input" placeholder="Proof image URL" value={proofUrl} onChange={e=>setProofUrl(e.target.value)} />
          <button className="btn-primary">Submit</button>
        </form>
      )}
      {msg && <p className="mt-3">{msg}</p>}
    </Shell>
  );
}
