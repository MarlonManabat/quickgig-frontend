'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://quickgig.ph';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const text = await res.text();
      let data: any = null; try { data = JSON.parse(text); } catch {}
      if (!res.ok || !data || data.success === false) {
        setError((data && data.message) ? data.message : ('Login failed. ' + text));
        setLoading(false);
        return;
      }

      // Persist basic auth state for the rest of the app
      try {
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth', 'true');
      } catch {}

      router.push('/');
    } catch (err:any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qg-container py-12">
      <div className="max-w-md mx-auto bg-white/70 rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-sm text-gray-600 mb-4">Sign in to your QuickGig account.</p>
        {error && <div className="bg-red-100 text-red-700 border border-red-200 rounded-lg p-3 mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border rounded-lg p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input className="w-full border rounded-lg p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="w-full bg-yellow-400 font-semibold rounded-lg py-2" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="text-sm mt-3">No account? <a className="text-sky-600 font-semibold" href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}
