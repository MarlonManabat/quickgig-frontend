'use client';
import { useState } from 'react';

export default function AdminPage() {
  const enabled = process.env.NEXT_PUBLIC_ADMIN_UI === 'true';
  const [eventForm, setEventForm] = useState({
    id: '',
    slug: '',
    title: '',
    venue: '',
    start_time: '',
    status: 'draft',
    tickets: '[]',
  });
  const [orderId, setOrderId] = useState('');
  if (!enabled) {
    return <main className="p-4">Admin UI disabled</main>;
  }

  async function submitEvent(e: React.FormEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = { ...eventForm, tickets: JSON.parse(eventForm.tickets || '[]') };
    if (!body.id) delete body.id;
    const method = body.id ? 'PATCH' : 'POST';
    const url = body.id ? '/api/admin/events/update' : '/api/admin/events/create';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    alert('saved');
  }

  async function markPaid(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/orders/mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: Number(orderId) }),
    });
    alert('marked');
  }

  return (
    <main className="p-4 space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-2">Create/Update Event</h1>
        <form onSubmit={submitEvent} className="space-y-2">
          <input
            className="border p-2 block w-full"
            placeholder="ID (for update)"
            value={eventForm.id}
            onChange={(e) => setEventForm({ ...eventForm, id: e.target.value })}
          />
          <input
            className="border p-2 block w-full"
            placeholder="Slug"
            value={eventForm.slug}
            onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })}
          />
          <input
            className="border p-2 block w-full"
            placeholder="Title"
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
          />
          <input
            className="border p-2 block w-full"
            placeholder="Venue"
            value={eventForm.venue}
            onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
          />
          <input
            className="border p-2 block w-full"
            placeholder="Start Time (YYYY-MM-DD HH:MM:SS)"
            value={eventForm.start_time}
            onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
          />
          <input
            className="border p-2 block w-full"
            placeholder="Status (draft/published)"
            value={eventForm.status}
            onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
          />
          <textarea
            className="border p-2 block w-full h-32"
            placeholder='Tickets JSON e.g. [{"name":"GA","price_cents":50000,"quantity_total":100}]'
            value={eventForm.tickets}
            onChange={(e) => setEventForm({ ...eventForm, tickets: e.target.value })}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Event
          </button>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">Mark Order Paid</h2>
        <form onSubmit={markPaid} className="space-y-2">
          <input
            className="border p-2 block w-full"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Mark Paid
          </button>
        </form>
      </section>
    </main>
  );
}
