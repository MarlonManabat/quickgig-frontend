'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { env } from '@/config/env';
import { track } from '@/lib/track';
import { register } from '@/lib/auth/client';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) { setError('All fields are required'); return; }
    setLoading(true);
    try {
      const data = await register({ name, email, password });
      if (!data?.ok) throw new Error(data?.message || 'Registration failed');
      if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) track('signup_success');
      router.push('/dashboard');
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (err instanceof TypeError || status === 0) {
        setError(
          'Check CORS for app.quickgig.ph on the API, and ensure API is HTTPS.'
        );
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qg-container py-12">
      <div className="max-w-md mx-auto bg-white/70 rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Register</h1>
        <p className="text-sm text-gray-600 mb-4">Create your QuickGig account.</p>
        {error && <div className="bg-red-100 text-red-700 border border-red-200 rounded-lg p-3 mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input className="w-full border rounded-lg p-2" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border rounded-lg p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input className="w-full border rounded-lg p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="w-full bg-yellow-400 font-semibold rounded-lg py-2" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm mt-3">Already have an account? <a className="text-sky-600 font-semibold" href="/login">Login</a></p>
      </div>
    </div>
  );
}
