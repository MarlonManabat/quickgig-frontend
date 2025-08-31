import Link from 'next/link';
import type { Gig } from '@/types/db';

export default function GigCard({ gig }: { gig: Gig }) {
  return (
    <li className="rounded-xl border p-4 flex flex-col gap-1">
      <Link href={`/gigs/${gig.id}`} className="text-lg font-medium hover:underline">
        {gig.title}
      </Link>
      <p className="text-sm text-slate-600">{gig.city || 'Anywhere'}</p>
      {gig.budget !== null && (
        <p className="text-sm">₱{Number(gig.budget).toLocaleString()}</p>
      )}
      <p className="text-xs text-slate-500">{new Date(gig.created_at).toLocaleDateString()}</p>
    </li>
  );
}
