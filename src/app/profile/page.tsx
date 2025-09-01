export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
import Form from './Form';
import { appHref } from '@/lib/appOrigin';

export default async function Page() {
  const cookie = cookies().toString();
  let data: any = {};
  try {
    const res = await fetch(appHref('/api/profile'), {
      headers: { cookie },
      cache: 'no-store',
    });
    if (res.ok) data = await res.json();
  } catch {
    // ignore
  }
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <Form initial={data} />
    </main>
  );
}
