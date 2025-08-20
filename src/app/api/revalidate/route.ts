import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const headerToken = req.headers.get('x-revalidate-token');
  const queryToken = url.searchParams.get('token');
  const token = headerToken ?? queryToken;
  if (token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { tags?: string[]; slug?: string } = {};
  try {
    body = await req.json();
  } catch {
    // ignore JSON parse errors
  }

  const revalidated: string[] = [];
  const tags = Array.isArray(body.tags) ? body.tags : [];
  for (const tag of tags) {
    revalidateTag(tag);
    revalidated.push(tag);
  }
  if (body.slug) {
    const tag = `event:${body.slug}`;
    revalidateTag(tag);
    revalidated.push(tag);
  }

  return NextResponse.json({ ok: true, revalidated });
}

export const runtime = 'edge';
