import { NextResponse } from 'next/server';
import { getServiceRoleKey, supabaseAdmin } from '@/utils/env';
export async function POST() {
  try {
    const serviceKey = getServiceRoleKey();
    const supabase = supabaseAdmin(serviceKey);
    // TODO: seed minimal demo data; keep idempotent
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

