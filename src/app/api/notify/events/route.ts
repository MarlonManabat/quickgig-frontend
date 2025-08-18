import { env } from '@/config/env';
import { addClient, removeClient } from '../_sse';

export const runtime = 'edge';

export async function GET(req: Request) {
  if (!env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER) {
    return new Response('skipped', { status: 204 });
  }
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  addClient(writer);
  const close = () => {
    removeClient(writer);
    try {
      writer.close();
    } catch {
      /* ignore */
    }
  };
  req.signal.addEventListener('abort', close);
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
