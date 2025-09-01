'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseSafe } from '@/lib/supabase/safeClient';
import { nextOr } from '@/lib/next-redirect';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function Confirm() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [msg, setMsg] = useState('');
  const searchParams = useSearchParams();
  const dest = nextOr(searchParams.get('next'), '/');

  useEffect(() => {
    const supabase = getSupabaseSafe();
    if (!supabase) {
      setOk(false);
      setMsg('Missing Supabase client');
      return;
    }
    supabase.auth.exchangeCodeForSession(window.location.href)
      .then(({ error }) => {
        if (error) { setOk(false); setMsg(error.message); }
        else {
          setOk(true);
          setMsg('Signed in! Redirecting…');
          setTimeout(() => { location.href = dest; }, 800);
        }
      });
  }, [dest]);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-2">Confirming…</h1>
      <p className={ok === false ? 'text-red-600' : ''}>{msg || 'Please wait…'}</p>
    </main>
  );
}
