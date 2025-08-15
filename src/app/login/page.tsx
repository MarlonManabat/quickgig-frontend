'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(''); setBusy(true);
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
    } catch { setErr('Auth service unreachable'); }
    finally { setBusy(false); }
  }

  return (
    <form id="login-form" onSubmit={onSubmit} noValidate>
      {err && <div role="alert" className="alert-error">{err}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={busy} className="btn btn-primary w-full">
        {busy ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}
