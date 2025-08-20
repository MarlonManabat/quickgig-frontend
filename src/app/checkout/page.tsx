'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Item {
  ticket_type_id: number;
  quantity: number;
}

export default function CheckoutPage() {
  const params = useSearchParams();
  const eventId = Number(params.get('event'));
  const items: Item[] = JSON.parse(params.get('items') || '[]');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (orderId) {
      timer = setInterval(async () => {
        const r = await fetch(`/api/orders/status?order_id=${orderId}`);
        const d = await r.json();
        setStatus(d.status);
        if (d.status === 'paid') clearInterval(timer);
      }, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [orderId]);

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, items, buyer: { email, name } }),
    });
    const d = await r.json();
    setOrderId(d.order_id);
    setStatus(d.status || 'pending');
  };

  if (orderId) {
    return (
      <main className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Order Created</h1>
        <p>Order ID: {orderId}</p>
        <p>Pay via GCash QR and present Order ID.</p>
        <p>Status: {status}</p>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={createOrder} className="space-y-2">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 block w-full"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 block w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Place Order
        </button>
      </form>
    </main>
  );
}
