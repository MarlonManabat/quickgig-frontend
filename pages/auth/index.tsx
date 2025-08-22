'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import Banner from '@/components/ui/Banner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
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
    <Card className="max-w-md mx-auto p-6">
      <h1>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
      {msg && <Banner kind="success">{msg}</Banner>}
      {err && <Banner kind="error">{err}</Banner>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid={mode === 'login' ? 'login-email' : 'signup-email'}
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid={mode === 'login' ? 'login-password' : 'signup-password'}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          data-testid={mode === 'login' ? 'login-submit' : 'signup-submit'}
        >
          {loading ? 'Working…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        {mode === 'login' ? 'No account?' : 'Have an account?'}{' '}
        <button className="underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </Card>
  );
}
