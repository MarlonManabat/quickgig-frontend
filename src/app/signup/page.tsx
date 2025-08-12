'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://quickgig.ph';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Job Seeker' | 'Employer'>('Job Seeker');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !phone || !password) { setError('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, phone, role, password })
      });
      const text = await res.text();
      let data: any = null; try { data = JSON.parse(text); } catch {}
      if (!res.ok || !data || data.success === false) {
        setError((data && data.message) ? data.message : ('Registration failed. ' + text));
        setLoading(false);
        return;
      }
      router.push('/login?register=success');
    } catch (err:any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qg-container py-12">
      <div className="max-w-xl mx-auto bg-white/70 rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-gray-600 mb-4">Join QuickGig in minutes.</p>
        {error && <div className="bg-red-100 text-red-700 border border-red-200 rounded-lg p-3 mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input className="w-full border rounded-lg p-2" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border rounded-lg p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input className="w-full border rounded-lg p-2" value={phone} onChange={e=>setPhone(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select className="w-full border rounded-lg p-2" value={role} onChange={e=>setRole(e.target.value as any)}>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Employer">Employer</option>
            </select>
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
