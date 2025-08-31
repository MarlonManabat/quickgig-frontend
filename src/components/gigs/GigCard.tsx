import Link from 'next/link';
import type { GigCardData } from '@/types/gigs';

interface Props {
  gig: GigCardData;
}

export default function GigCard({ gig }: Props) {
  return (
    <li className="rounded border p-4 space-y-1">
      <h3 className="font-semibold">{gig.title}</h3>
      <p className="text-sm text-slate-600">
        {gig.company} • {gig.region}
      </p>
      <p className="text-sm">
        {gig.rate ? `₱${gig.rate.toLocaleString()}` : '—'}
      </p>
      <Link href={`/gigs/${gig.id}`} className="text-sm text-blue-600">
        View
      </Link>
    </li>
  );
}
