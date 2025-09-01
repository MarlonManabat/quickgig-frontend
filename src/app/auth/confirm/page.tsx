'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function Confirm() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href)
      .then(({ error }) => {
        if (error) { setOk(false); setMsg(error.message); }
        else { setOk(true); setMsg('Signed in! Redirecting…'); setTimeout(()=>{ location.href = '/'; }, 800); }
      });
  }, []);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-2">Confirming…</h1>
      <p className={ok === false ? 'text-red-600' : ''}>{msg || 'Please wait…'}</p>
    </main>
  );
}
