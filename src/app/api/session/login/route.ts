import { NextRequest } from 'next/server';
import { proxyPhp } from '@/lib/proxy';

export async function OPTIONS() {
  // CORS preflight OK on same-origin (not strictly needed, but harmless)
  return new Response(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  return proxyPhp(req, '/login.php');
}
