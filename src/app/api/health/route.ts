import { log } from '@/lib/log';

export const runtime = 'nodejs';

export async function GET() {
  const envOk = Boolean(process.env.JWT_COOKIE_NAME);
  const time = new Date().toISOString();
  const state = envOk ? 'ok' : 'degraded';
  log(`[health] ${state}`, { envOk, time });
  return Response.json({
    ok: true,
    services: {
      app: envOk ? 'up' : 'degraded',
    },
    time,
  });
}
