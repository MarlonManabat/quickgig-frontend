import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supa = adminSupabase();
  const { data, error } = await supa
    .from('gigs')
    .select('id, title, description, city, budget, created_at, status, published')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const supa = adminSupabase();
  const { data, error } = await supa.from('gigs').insert({
    title: payload.title,
    description: payload.description,
    city: payload.city ?? null,
    budget: payload.budget ?? null,
    status: 'open',
    published: true,
    owner: payload.owner,
  }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
