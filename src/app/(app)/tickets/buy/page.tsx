'use client';

import { useState } from 'react';
import OrderCard, { Order } from '@/components/tickets/OrderCard';

const packages = [
  { qty: 1, price: 20 },
  { qty: 5, price: 100 },
  { qty: 10, price: 200 },
];

export default function BuyTicketsPage() {
  const [order, setOrder] = useState<Order | null>(null);

  async function createOrder(qty: number) {
    const resp = await fetch('/api/tickets/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty }),
    });
    const json = await resp.json();
    if (json?.order) setOrder(json.order);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Buy Tickets</h1>
      <div className="flex gap-4">
        {packages.map((p) => (
          <button
            key={p.qty}
            id={`buy-${p.qty}`}
            className="border rounded p-4 flex-1"
            onClick={() => createOrder(p.qty)}
          >
            {p.qty} for ₱{p.price}
          </button>
        ))}
      </div>
      {order && <OrderCard order={order} />}
    </div>
  );
}
