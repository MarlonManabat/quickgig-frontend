'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { env } from '@/config/env';
import { track } from '@/lib/track';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      console.log('[login] submit', { email });
      const res = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok) {
        if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) track('login_success');
        router.replace('/dashboard');
        return;
      }
      setErr(data?.message || 'Invalid email or password');
    } catch {
      setErr('Auth service unreachable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qg-container py-12">
      <div className="max-w-md mx-auto bg-white/70 rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-sm text-gray-600 mb-4">Sign in to your QuickGig account.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          {err ? (
            <div role="alert" className="bg-red-100 text-red-700 border border-red-200 rounded-lg p-3">
              {err}
            </div>
          ) : null}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full border rounded-lg p-2"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full border rounded-lg p-2"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-yellow-400 font-semibold rounded-lg py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="text-sm mt-3">No account? <a className="text-sky-600 font-semibold" href="/register">Sign up</a></p>
      </div>
    </div>
  );
}
