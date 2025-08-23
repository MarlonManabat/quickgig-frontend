'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import Banner from '@/components/ui/Banner';
import { getProfile } from '@/utils/session';
import { copy } from '@/copy';

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
    <main className="max-w-xl w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === 'login' ? copy.auth.loginTitle : copy.auth.signupTitle}
      </h1>
      {msg && <Banner kind="success">{msg}</Banner>}
      {err && <Banner kind="error">{err}</Banner>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">{copy.auth.email}</label>
          <input
            id="email"
            type="email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">{copy.auth.password}</label>
          <input
            id="password"
            type="password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} aria-busy={loading} className="btn-primary px-4 py-2 rounded">
          {loading ? '...' : mode === 'login' ? copy.auth.login : copy.auth.signup}
        </button>
      </form>
      <p className="mt-4 text-sm">
        {mode === 'login' ? 'No account?' : 'Have an account?'}{' '}
        <button className="underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? copy.auth.signup : copy.auth.login}
        </button>
      </p>
    </main>
  );
}
