'use client';
import './legacy-login.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const needle = 'login' + '.php';
    const h = (e: Event) => {
      const t = e.target as HTMLFormElement | null;
      if (t?.tagName === 'FORM') {
        const action = (t.getAttribute('action') || '').toLowerCase();
        if (action.includes(needle)) {
          e.preventDefault();
        }
      }
    };
    document.addEventListener('submit', h, true);
    return () => document.removeEventListener('submit', h, true);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        router.replace('/dashboard');
      } else {
        setErr(json?.message || 'Invalid email or password');
      }
    } catch {
      setErr('Auth service unreachable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="legacy-login">
      <div className="login-card">
        <h1>Login</h1>
        <p className="subtitle">Sign in to your QuickGig account.</p>
        <form onSubmit={onSubmit} className="login-form">
          {err && (
            <div role="alert" className="error-banner">
              {err}
            </div>
          )}
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="signup-link">
          No account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

