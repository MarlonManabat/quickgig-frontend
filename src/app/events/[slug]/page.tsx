'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: number;
  name: string;
  price_cents: number;
  remaining: number;
}

interface EventInfo {
  id: number;
  title: string;
  description?: string;
}

interface EventData {
  event: EventInfo;
  tickets: Ticket[];
}

export default function EventDetail({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<EventData | null>(null);
  const [qty, setQty] = useState<Record<number, number>>({});
  const router = useRouter();
  useEffect(() => {
    fetch(`/api/events/show?slug=${params.slug}`)
      .then((r) => r.json())
      .then(setData);
  }, [params.slug]);
  if (!data) return <main className="p-4">Loading...</main>;
  const { event, tickets } = data;
  const checkout = () => {
    const items = Object.entries(qty)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => ({ ticket_type_id: Number(id), quantity: q }));
    const url = `/checkout?event=${event.id}&items=${encodeURIComponent(JSON.stringify(items))}`;
    router.push(url);
  };
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <div className="space-y-2">
        {tickets.map((t: Ticket) => (
          <div key={t.id} className="border p-2 rounded">
            <p className="font-semibold">
              {t.name} - {t.price_cents / 100} PHP (remaining {t.remaining})
            </p>
            <input
              type="number"
              min={0}
              max={t.remaining}
              value={qty[t.id] || 0}
              onChange={(e) => setQty({ ...qty, [t.id]: Number(e.target.value) })}
              className="border px-2 py-1 mt-1"
            />
          </div>
        ))}
      </div>
      <button onClick={checkout} className="bg-blue-600 text-white px-4 py-2 rounded">
        Checkout
      </button>
    </main>
  );
}
