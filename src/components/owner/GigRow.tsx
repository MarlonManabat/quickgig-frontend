'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { OwnerGigRow } from '@/types/owner';

export default function GigRow({ gig }: { gig: OwnerGigRow }) {
  const [status, setStatus] = useState(gig.status);

  const toggle = async () => {
    const next = status === 'open' ? 'closed' : 'open';
    setStatus(next);
    try {
      await fetch(`/api/owner/gigs/${gig.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
    } catch {
      setStatus(status);
    }
  };

  return (
    <li className="p-4 flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">{gig.title}</p>
        <p className="text-sm text-gray-600">
          {gig.city} · ₱{gig.budget} ·{' '}
          {new Date(gig.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            status === 'open'
              ? 'bg-green-200 text-green-800'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {status}
        </span>
        <Link
          href={`/owner/gigs/${gig.id}/applicants`}
          className="text-blue-600 underline text-sm"
        >
          View applicants
        </Link>
        <button
          className="text-sm border rounded px-2 py-1"
          onClick={toggle}
        >
          {status === 'open' ? 'Close' : 'Open'}
        </button>
      </div>
    </li>
  );
}
