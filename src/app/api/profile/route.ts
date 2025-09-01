import { NextResponse } from 'next/server';
import { userIdFromCookie } from '@/lib/supabase/server';
import { getProfile, upsertProfile } from '@/lib/profile/server';
import { profileInput } from '@/lib/profile/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({});
  const data = await getProfile(uid);
  if (!data) return NextResponse.json({});
  return NextResponse.json({
    fullName: data.fullName,
    location: data.location,
    bio: data.bio,
  });
}

export async function POST(req: Request) {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = profileInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  await upsertProfile(uid, parsed.data);
  return NextResponse.json({ ok: true });
}
