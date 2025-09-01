export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { applicationsForUser } from './server';
import Link from 'next/link';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    viewed: 'bg-violet-100 text-violet-800',
    interviewing: 'bg-amber-100 text-amber-800',
    rejected: 'bg-rose-100 text-rose-800',
    withdrawn: 'bg-slate-200 text-slate-700',
    hired: 'bg-emerald-100 text-emerald-800',
  };
  return <span className={`px-2 py-0.5 rounded text-xs ${map[status] ?? 'bg-slate-100 text-slate-800'}`}>{status}</span>;
}

async function List() {
  const { items, canMutate, issue } = await applicationsForUser();
  return (
    <div className="space-y-4">
      {issue && (
        <div className="text-xs text-slate-600 bg-slate-50 border rounded p-2">
          Running in mock/read-only mode: {issue}
        </div>
      )}
      {items.length === 0 ? (
        <p className="text-slate-600">No applications yet.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map((a) => (
            <li key={a.id} className="border rounded p-4 flex items-start justify-between">
              <div>
                <div className="font-medium">
                  <Link href={`/gigs/${a.gig_id}`} className="underline">
                    {a.gig_title ?? `Gig ${a.gig_id}`}
                  </Link>
                </div>
                <div className="text-sm text-slate-600">
                  Applied {new Date(a.created_at).toLocaleString()}
                </div>
                <div className="mt-2">
                  <StatusBadge status={a.status} />
                </div>
              </div>
              <form action={`/api/applications/${a.id}/withdraw`} method="post">
                <button
                  className="text-sm border rounded px-3 py-1 disabled:opacity-50"
                  disabled={!canMutate || a.status === 'withdrawn' || a.status === 'rejected' || a.status === 'hired'}
                >
                  Withdraw
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      <Suspense fallback={<div className="animate-pulse h-28 bg-slate-200 rounded" />}>
        {/* @ts-expect-error Async Server Component */}
        <List />
      </Suspense>
    </main>
  );
}

