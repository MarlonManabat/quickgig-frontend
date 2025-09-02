'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { nextOr } from '@/lib/next-redirect';

export default function ConfirmClient() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [msg, setMsg] = useState('');
  const searchParams = useSearchParams();
  const dest = nextOr(searchParams.get('next'), '/');

  useEffect(() => {
    supabaseBrowser()
      .auth.exchangeCodeForSession(window.location.href)
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
