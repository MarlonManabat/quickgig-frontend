import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const form = await req.formData();
  const supa = adminSupabase();
  const { error } = await supa.from('gig_applications').insert({
    gig_id: Number(form.get('gig_id')),
    applicant: 'stub-worker',
    cover_letter: form.get('cover_letter')?.toString() ?? null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(req: Request) {
  const supa = adminSupabase();
  const { searchParams } = new URL(req.url);
  const user = searchParams.get('user');
  if (!user) return NextResponse.json({ items: [] });
  const { data, error } = await supa
    .from('gig_applications')
    .select('id, gig_id, created_at, cover_letter')
    .eq('applicant', user)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
