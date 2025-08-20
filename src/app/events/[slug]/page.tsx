interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Event {
  id: number;
  slug: string;
  name: string;
  description?: string;
  ticket_types?: TicketType[];
}

export default async function EventPage({ params }: { params?: { slug?: string } }) {
  const slug = params?.slug;
  if (!slug) {
    return <div>Not found</div>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/show.php?slug=${encodeURIComponent(slug)}`,
      { next: { tags: ['events'] } }
    );
    if (!res.ok) {
      return <div>Not found</div>;
    }
    const event: Event = await res.json();
    if (!event || !event.name) {
      return <div>Not found</div>;
    }
    return (
      <div>
        <h1>{event.name}</h1>
        {event.description && <p>{event.description}</p>}
      </div>
    );
  } catch {
    return <div>Not found</div>;
  }
}
