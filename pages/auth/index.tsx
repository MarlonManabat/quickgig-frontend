'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import Banner from '@/components/Banner';
import { getProfile } from '@/utils/session';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg('Logged in.');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg('Signed up. Check email if confirmation is required.');
      }
      const profile = await getProfile();
      const dest = !profile?.full_name ? '/profile?onboarding=1' : '/gigs';
      setTimeout(() => router.replace(dest), 500);
    } catch (e: any) {
      setErr(e.message ?? 'Auth error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
      {msg && <Banner kind="success">{msg}</Banner>}
      {err && <Banner kind="error">{err}</Banner>}
      <form onSubmit={onSubmit} className="max-w-md">
        <label htmlFor="email" className="block">Email</label>
        <input
          id="email"
          type="email"
          className="w-full border rounded-md px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password" className="block">Password</label>
        <input
          id="password"
          type="password"
          className="w-full border rounded-md px-3 py-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Working…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        {mode === 'login' ? 'No account?' : 'Have an account?'}{' '}
        <button className="underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
