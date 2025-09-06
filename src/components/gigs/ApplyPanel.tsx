'use client';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import { RequireTickets } from '@/components/RequireTickets';
import { ROUTES } from '@/lib/routes';

export function ApplyPanel({ gigId }: { gigId: string }) {
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string|undefined>();

  async function onApply() {
    setSubmitting(true); setErr(undefined);
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ gig_id: gigId, user_id: user?.id ?? null })
    });
    const json = await res.json();
    if (!res.ok) { setErr(json.error || 'Failed'); setSubmitting(false); return; }
    setDone(true); setSubmitting(false);
  }

  if (!user)
    return (
      <p className="text-slate-600">
        Please{' '}
        <a className="underline" href={ROUTES.login}>
          sign in
        </a>{' '}
        to apply.
      </p>
    );
  if (done) return <p className="text-green-700">Application submitted.</p>;
  return (
    <div className="space-y-2">
      {err && <p className="text-red-600">{err}</p>}
      <RequireTickets need={1}>
        {(ok) => (
          <button
            disabled={!ok || submitting}
            onClick={() =>
              ok
                ? onApply()
                : alert('You need 1 ticket to apply. Check your balance or earn more.')
            }
            className="rounded bg-black text-white px-4 py-2"
          >
            Apply
          </button>
        )}
      </RequireTickets>
    </div>
  );
}
