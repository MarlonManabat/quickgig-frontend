'use client';
import React, { useState } from 'react';
import LocationSelect from '@/components/LocationSelect';
import { createClient } from '@/lib/supabase';

export default function PostJobPage() {
  const supa = createClient();
  const [form, setForm] = useState({ title:'', description:'', region_code:'', city_code:'', price_php:'' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);

    const fd = new FormData(e.currentTarget);
    const title       = String(fd.get('title') || '').trim();
    const description = String(fd.get('description') || '').trim();
    const region_code = String(fd.get('region_code') || '').trim();
    const city_code   = String(fd.get('city_code') || '').trim();
    const price_php   = Number(fd.get('price_php') || 0);

    const { data, error } = await supa.rpc('create_gig_public', {
      p_title: title,
      p_description: description,
      p_region_code: region_code,
      p_city_code: city_code,
      p_price_php: price_php,
    });

    setSubmitting(false);

    if (error) {
      setErr(error.message || 'Create failed');
      return;
    }

    window.location.href = `/find`;
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
