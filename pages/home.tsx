import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function pick(role: 'worker' | 'employer') {
    setSaving(true);
    await fetch('/api/profile/set-role-pref', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    }).catch(() => {});
    router.push(role === 'worker' ? '/dashboard/worker' : '/dashboard/employer');
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to QuickGig.ph</h1>
      <p className="mb-3">Piliin ang gagamitin mong role:</p>
      <div className="flex gap-3">
        <button disabled={saving} onClick={() => pick('worker')} className="qg-btn qg-btn--primary px-4 py-2">Job Seeker</button>
        <button disabled={saving} onClick={() => pick('employer')} className="qg-btn qg-btn--outline px-4 py-2">Employer</button>
      </div>
    </main>
  );
}
