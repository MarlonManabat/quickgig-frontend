import Link from 'next/link';

interface Event {
  slug: string;
  title: string;
  venue: string;
  start_time: string;
}

export default async function EventsPage() {
  let events: Event[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/index.php`,
      { next: { tags: ['events'] } }
    );
    if (res.ok) {
      events = await res.json();
    }
  } catch {
    // ignore fetch/parse errors
  }

  if (!Array.isArray(events) || events.length === 0) {
    return <div>No events.</div>;
  }

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((ev) => (
          <li key={ev.slug}>
            <Link href={`/events/${ev.slug}`}>
              {ev.title} - {new Date(ev.start_time).toLocaleString()} @ {ev.venue}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
