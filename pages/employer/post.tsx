"use client";
import * as React from 'react';
import LocationSelect from '@/components/LocationSelect';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import PostGuardInline from '@/components/auth/PostGuardInline';
import { getBrowserSupabase } from '@/lib/supabase-browser';

let supabase = createBrowserSupabaseClient();
export function __setSupabaseClient(client: any) {
  supabase = client;
}

export async function submit(form: FormData) {
  const title = form.get('title') as string;
  const description = form.get('description') as string;
  const region_code = form.get('region_code') as string;
  const city_code = form.get('city_code') as string;
  const price_php = Number(form.get('price_php'));

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please log in');

  const payload = {
    p_title: title,
    p_description: description,
    p_region_code: region_code,
    p_city_code: city_code,
    p_price_php: Number(price_php),
  };

  let { data, error } = await supabase.rpc('create_gig_public', payload);
  if (error && /function.*not found|schema cache/i.test(error.message)) {
    await new Promise((r) => setTimeout(r, 1200));
    ({ data, error } = await supabase.rpc('create_gig_public', payload));
  }
  if (error) throw new Error(error.message);
  return data;
}

function useSupabaseSession() {
  const [session, setSession] = React.useState<any>(null);
  React.useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const sb = getBrowserSupabase();
        if (!sb) {
          if (mounted) setSession(null);
          return;
        }
        const { data } = await sb.auth.getSession();
        if (mounted) setSession(data?.session ?? null);
      } catch {
        if (mounted) setSession(null);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);
  return session;
}

export default function PostJobPage() {
  const session = useSupabaseSession();
  const [form, setForm] = React.useState({ title:'', description:'', region_code:'', city_code:'', price_php:'' });
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState<string|null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);

    try {
      await submit(new FormData(e.currentTarget));
      setForm({ title:'', description:'', region_code:'', city_code:'', price_php:'' });
      window.location.href = `/find`;
    } catch (e: any) {
      setErr(e.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PostGuardInline session={session}>
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
    </PostGuardInline>
  );
}
