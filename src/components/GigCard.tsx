import Link from 'next/link';
import type { Gig } from '@/types/db';
import { formatCurrencyPHP, formatDatePH } from '@/lib/format';

export default function GigCard({ gig }: { gig: Gig }) {
  return (
    <li className="rounded-xl border p-4 flex flex-col gap-1">
      <Link href={`/gigs/${gig.id}`} className="text-lg font-medium hover:underline">
        {gig.title}
      </Link>
      <p className="text-sm text-slate-600">{gig.city || 'Anywhere'}</p>
      {gig.budget !== null && (
        <p className="text-sm">{formatCurrencyPHP(Number(gig.budget))}</p>
      )}
      <p className="text-xs text-slate-500">{formatDatePH(gig.created_at)}</p>
    </li>
  );
}
