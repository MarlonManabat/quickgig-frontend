import { env } from '@/config/env';

export const runtime = 'nodejs';

export async function GET() {
  return Response.json(
    {
      apiUrlSet: !!env.API_URL,
      vercelEnv: process.env.VERCEL_ENV ?? 'unknown',
    },
    { headers: { 'cache-control': 'no-store' } }
  );
}
