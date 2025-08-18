import type { NotifyItem } from '@/types/notify';

const g = globalThis as unknown as {
  __notify_clients: Set<WritableStreamDefaultWriter>;
};
if (!g.__notify_clients) {
  g.__notify_clients = new Set<WritableStreamDefaultWriter>();
}
const encoder = new TextEncoder();

export function addClient(w: WritableStreamDefaultWriter) {
  g.__notify_clients.add(w);
}

export function removeClient(w: WritableStreamDefaultWriter) {
  g.__notify_clients.delete(w);
}

export function broadcast(item: NotifyItem) {
  const data = `data: ${JSON.stringify(item)}\n\n`;
  g.__notify_clients.forEach((w) => {
    try {
      w.write(encoder.encode(data));
    } catch {
      /* ignore */
    }
  });
}
