'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type Item = { ticket_type_id: number; quantity: number };

function CheckoutContent() {
  const search = useSearchParams();
  const { eventId, items } = useMemo(() => {
    const s = search;
    const eventStr = s?.get('event') ?? '';
    const eventId = Number.isFinite(Number(eventStr)) ? Number(eventStr) : 0;
    const itemsJson = s?.get('items') ?? '[]';
    let items: Item[] = [];
    try { items = JSON.parse(itemsJson); } catch { items = []; }
    return { eventId, items };
  }, [search]);

  if (!eventId) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Invalid checkout link</h1>
        <p className="mt-2"><a className="underline" href="/events">Browse events</a></p>
      </main>
    );
  }

  void items; // items will be used for order summary and creation.

  return (
    <main className="p-6">
      {/* TODO: summary, order create, polling, etc. */}
      <h1 className="text-xl font-semibold">Checkout</h1>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading...</main>}>
      <CheckoutContent />
    </Suspense>
  );
}
