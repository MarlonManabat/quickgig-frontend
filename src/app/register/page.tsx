'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../lib/auth';
import { toast } from '@/lib/toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(email, password, name);
      router.push('/account');
    } catch {
      toast('Registration failed');
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Register</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
          required
        />
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
          Register
        </button>
      </form>
    </main>
  );
}
