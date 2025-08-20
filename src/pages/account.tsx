import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { updateProfile } from '../../lib/auth';

interface User {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
}

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) {
          router.push('/login');
          return;
        }
        setUser(u);
        setName(u.name || '');
        setPhone(u.phone || '');
      });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await updateProfile({ name, phone });
      setUser(res.user);
      setMessage('Saved');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error');
    }
  }

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Account</h1>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Save
        </button>
      </form>
    </main>
  );
}
