'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email] = useState('');
  const [password] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok) { router.replace('/dashboard'); return; }
      setErr(data?.message || 'Invalid email or password');
    } catch {
      setErr('Auth service unreachable');
    } finally { setLoading(false); }
  }

  return (
    <form id="login-form" data-testid="login-form" onSubmit={onSubmit} noValidate>
      {err && <div role="alert" className="alert-error">{err}</div>}
      {/* bind to your existing inputs */}
      {/* <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /> */}
      {/* <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /> */}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}
