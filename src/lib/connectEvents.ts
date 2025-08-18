export type EventHandler = (data: unknown) => void;

export function connectEvents(handler: EventHandler) {
  if (process.env.NEXT_PUBLIC_ENABLE_SOCKETS === 'true') {
    const url = `${process.env.ENGINE_BASE_URL || ''}/events`;
    const es = new EventSource(url, { withCredentials: true });
    es.onmessage = (evt) => {
      try {
        handler(JSON.parse(evt.data));
      } catch {
        // ignore
      }
    };
    return () => es.close();
  }
  let active = true;
  const poll = async () => {
    while (active) {
      try {
        const r = await fetch('/api/notifications/events');
        const j = await r.json().catch(() => ({}));
        if (Array.isArray(j.events)) j.events.forEach(handler);
      } catch {
        // ignore
      }
      await new Promise((r) => setTimeout(r, Number(process.env.EVENTS_POLL_MS) || 5000));
    }
  };
  poll();
  return () => {
    active = false;
  };
}
