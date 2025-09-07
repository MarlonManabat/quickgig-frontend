'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Application, ApplicationStatus } from '@/types/db';
import toast from '@/utils/toast';
import { ROUTES } from '@/app/lib/routes';
import Button from '@/components/ui/Button';

function canWithdraw(status: ApplicationStatus) {
  return status === 'pending' || status === 'approved';
}

export default function ApplicationsPageClient({ initialApps }: { initialApps: Application[] }) {
  const [items, setItems] = useState(initialApps);

  async function handleWithdraw(id: string) {
    const res = await fetch(`/api/applications/${id}/withdraw`, {
      method: 'POST',
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'withdrawn' } : a)),
      );
      toast.success('Application withdrawn');
    } else {
      let msg = 'Unable to withdraw';
      try {
        const data = await res.json();
        msg = data.error || msg;
      } catch {}
      toast.error(msg);
    }
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4 text-center" data-testid="applications-empty">
        <p className="text-slate-500">No applications yet.</p>
        <Link
          href={ROUTES.GIGS_BROWSE}
          data-testid="browse-jobs-from-empty"
          data-cta="browse-jobs-from-empty"
        >
          <Button variant="primary">Browse jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          <th className="py-2">Title</th>
          <th className="py-2">Company</th>
          <th className="py-2">Status</th>
          <th className="py-2">Applied</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {items.map((a) => (
          <tr data-testid="application-item" key={a.id} className="border-t">
            <td className="py-2">{a.title}</td>
            <td className="py-2">{a.company}</td>
            <td className="py-2 capitalize">{a.status}</td>
            <td className="py-2">{new Date(a.created_at).toLocaleDateString()}</td>
            <td className="py-2">
              {canWithdraw(a.status) && (
                <button onClick={() => handleWithdraw(a.id)} className="text-xs underline">
                  Withdraw
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

