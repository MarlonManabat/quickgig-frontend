'use client';
import * as React from 'react';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    console.log('[login] App Router page active');
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && (data?.ok ?? true)) {
        location.replace('/dashboard');
      } else {
        setErr(data?.message || 'Invalid email or password');
      }
    } catch {
      setErr('Auth service unreachable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form id="login-form" onSubmit={onSubmit} noValidate>
        <label className="block mb-2">
          <span className="block text-sm">Email</span>
          <input className="w-full border rounded p-2" type="email" value={email}
            onChange={(e)=>setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="block mb-4">
          <span className="block text-sm">Password</span>
          <input className="w-full border rounded p-2" type="password" value={password}
            onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        <button type="submit" disabled={loading}
          className="w-full rounded bg-yellow-400 py-2 font-medium disabled:opacity-60">
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </main>
  );
}
