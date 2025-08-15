import { NextResponse } from 'next/server';

export async function GET() {
  const start = Date.now();
  const res = NextResponse.json({ ok: true }, { status: 200 });
  const duration = Date.now() - start;
  console.log(`GET /system/status 200 ${duration}ms`);
  return res;
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
