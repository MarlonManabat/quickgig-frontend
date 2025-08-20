import Link from 'next/link';

interface EventItem {
  slug: string;
  title: string;
}

export default async function EventsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/index.php`, {
    next: { revalidate: 60, tags: ['events'] },
  });
  const events: EventItem[] = await res.json();
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Events</h1>
      <ul className="list-disc pl-4 space-y-1">
        {events.map((e) => (
          <li key={e.slug}>
            <Link href={`/events/${e.slug}`}>{e.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
