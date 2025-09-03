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
    <main className="container mx-auto max-w-full sm:max-w-screen-lg px-4 py-6">
      <div className="mx-auto max-w-md">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Sign in</h1>
        {sent ? (
          <p>Check your email for a magic link.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              className="w-full min-w-0 border rounded p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {err && <p className="text-red-600">{err}</p>}
            <button className="w-full sm:w-auto rounded bg-black text-white px-4 py-2">Send magic link</button>
          </form>
        )}
      </div>
    </main>
  );
}
