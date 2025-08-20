'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../../lib/auth';
import { toast } from '@/lib/toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/account');
    } catch {
      toast('Login failed');
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Login</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Login
        </button>
      </form>
    </main>
  );
}
