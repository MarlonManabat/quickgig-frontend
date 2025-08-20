import { notFound } from 'next/navigation';

interface EventDetails {
  slug: string;
  title: string;
  venue?: string;
  start_time?: string;
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/show.php?slug=${params.slug}`, {
    next: { revalidate: 60, tags: ['events'] },
  });
  if (!res.ok) {
    notFound();
  }
  const event: EventDetails = await res.json();
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">{event.title}</h1>
      {event.venue && <p>Venue: {event.venue}</p>}
      {event.start_time && <p>Start: {event.start_time}</p>}
    </main>
  );
}
