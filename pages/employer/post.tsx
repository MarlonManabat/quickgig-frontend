'use client';
import React, { useState } from 'react';
import LocationSelect from '@/components/LocationSelect';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

const supa = createBrowserSupabaseClient();

async function submit(form: FormData) {
  const title = form.get('title') as string;
  const description = form.get('description') as string;
  const region_code = form.get('region_code') as string;
  const city_code = form.get('city_code') as string;
  const price_php = Number(form.get('price_php'));

  // need the current user id for ticket debit
  const { data: { user } } = await supa.auth.getUser();
  if (!user) throw new Error('Please log in');

  const res = await fetch('/api/gigs/create', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      title, description, region_code, city_code, price_php, user_id: user.id,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to create gig');
  return json;
}

export default function PostJobPage() {
  const [form, setForm] = useState({ title:'', description:'', region_code:'', city_code:'', price_php:'' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);

    try {
      await submit(new FormData(e.currentTarget));
      window.location.href = `/find`;
    } catch (e: any) {
      setErr(e.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4 min-h-[60vh]">
      <h1 className="text-2xl font-semibold">Post a Job</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="title" className="border rounded-xl p-2 w-full" placeholder="Title"
               value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} />
        <textarea name="description" className="border rounded-xl p-2 w-full" placeholder="Description"
                  value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} />
        <LocationSelect value={{ region_code: form.region_code, city_code: form.city_code }}
                        onChange={(v)=>setForm(f=>({...f, ...v}))} />
        <input type="hidden" name="region_code" value={form.region_code} />
        <input type="hidden" name="city_code" value={form.city_code} />
        <input name="price_php" className="border rounded-xl p-2 w-full" placeholder="Budget (optional)" inputMode="numeric"
               value={form.price_php} onChange={e=>setForm(f=>({...f, price_php:e.target.value}))} />
        {err && <p role="alert" className="text-red-500">{err}</p>}
        <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-black text-white">Create</button>
      </form>
    </main>
  );
}
