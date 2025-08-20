interface TicketType {
  name: string;
  price_cents: number;
  quantity_total: number;
}

interface Event {
  slug: string;
  title: string;
  venue: string;
  start_time: string;
  tickets?: TicketType[];
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/show.php?slug=${encodeURIComponent(slug)}`,
      { next: { tags: ['events', `event:${slug}`] } }
    );
    if (!res.ok) {
      return <div>Not found</div>;
    }
    const event: Event = await res.json();
    return (
      <div>
        <h1>{event.title}</h1>
        <p>
          {new Date(event.start_time).toLocaleString()} @ {event.venue}
        </p>
        {event.tickets && event.tickets.length > 0 && (
          <ul>
            {event.tickets.map((t) => (
              <li key={t.name}>
                {t.name}: ₱{(t.price_cents / 100).toFixed(2)} ({t.quantity_total})
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  } catch {
    return <div>Not found</div>;
  }
}
