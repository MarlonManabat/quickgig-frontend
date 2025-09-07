'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Confirming() {
  const params = useSearchParams();
  const next = params.get('next') || '/applications';
  const error = params.get('error');
  const router = useRouter();

  useEffect(() => {
    if (!error) router.replace(next);
  }, [error, next, router]);

  if (!error) return <p className="p-6">Confirming…</p>;

  const msg = error === 'session'
    ? 'Your sign-in session expired or was interrupted.'
    : 'We could not complete sign-in.';

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Confirming…</h1>
      <p className="text-red-600">{msg}</p>
      <button
        className="px-4 py-2 rounded bg-black text-white"
        onClick={() => window.location.assign(`/login?next=${encodeURIComponent(next)}`)}
      >
        Try signing in again
      </button>
    </div>
  );
}

