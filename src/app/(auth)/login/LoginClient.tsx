'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { safeNext } from '@/lib/safe-next';

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get('next'));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const dest = `${location.origin}/auth/confirm${
      next ? `?next=${encodeURIComponent(next)}` : ''
    }`;
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: dest }
    });
    if (error) setErr(error.message); else setSent(true);
  }

  return (
    <main className="mx-auto max-w-screen-md px-4 sm:px-6 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      {sent ? (
        <p>Check your email for a magic link.</p>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            className="w-full rounded border text-base h-11 px-3"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          {err && <p className="text-red-600">{err}</p>}
          <button className="h-11 w-fit rounded-lg bg-black px-4 text-white">Send magic link</button>
        </form>
      )}
    </main>
  );
}
