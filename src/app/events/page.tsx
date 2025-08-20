'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  slug: string;
  title: string;
  start_time: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    fetch('/api/events/index')
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []));
  }, []);
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Events</h1>
      <ul className="space-y-2">
        {events.map((e) => (
          <li key={e.id}>
            <Link className="text-blue-600 underline" href={`/events/${e.slug}`}>
              {e.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
