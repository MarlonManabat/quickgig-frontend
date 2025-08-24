import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function Home() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
    })();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Home</h1>
        {email && <span className="text-sm text-gray-600">{email}</span>}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Quick actions">
          <div className="flex flex-wrap gap-2">
            <Link className="qg-btn qg-btn--primary px-3 py-2" href="/find">Browse jobs</Link>
            <Link className="qg-btn qg-btn--outline px-3 py-2" href="/post">Post a job</Link>
            <Link className="qg-btn qg-btn--white px-3 py-2" href="/profile">Edit profile</Link>
          </div>
        </Card>
        <Card title="Messages">
          <p className="text-sm text-gray-600">Continue conversations.</p>
          <Link className="inline-block mt-2 qg-btn qg-btn--white px-3 py-2" href="/messages">Open messages</Link>
        </Card>
        <Card title="Tickets">
          <p className="text-sm text-gray-600">Check your balance and history.</p>
          <Link className="inline-block mt-2 qg-btn qg-btn--outline px-3 py-2" href="/wallet">Go to wallet</Link>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Tips</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
          <li>Complete your profile for better matches.</li>
          <li>Enable email notifications to never miss a message.</li>
        </ul>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: any }) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      {children}
    </div>
  );
}
