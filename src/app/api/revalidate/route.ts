import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('secret');
  if (token !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const tag = url.searchParams.get('tag') ?? 'events';
  try {
    revalidateTag(tag);
    return NextResponse.json({ ok: true, tag });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
