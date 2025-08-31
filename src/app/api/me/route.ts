import { NextResponse } from 'next/server';
import { adminSupabase, userIdFromCookie } from '@/lib/supabase/server';
import type { Profile } from '@/types/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uid = await userIdFromCookie();
  if (!uid) return NextResponse.json({ needsProfile: true });

  const supa = adminSupabase();
  const { data, error } = await supa
    .from('profiles')
    .select('id, full_name, avatar_url, role, created_at, can_post_job')
    .eq('id', uid)
    .single();
  if (error || !data) return NextResponse.json({ needsProfile: true });
  return NextResponse.json(data as Profile);
}
