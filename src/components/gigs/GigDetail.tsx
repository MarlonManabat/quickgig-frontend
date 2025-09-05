import type { GigDetail as Gig } from '@/types/gigs';

export default function GigDetailComponent({ gig }: { gig: Gig }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{gig.title}</h1>
      <p className="text-sm text-slate-600">
        {gig.company} · {gig.region || 'Anywhere'} ·{' '}
        {new Date(gig.created_at).toLocaleDateString()}
      </p>
      {gig.rate !== null && (
        <p className="text-sm font-medium">₱{gig.rate}</p>
      )}
      <p className="whitespace-pre-wrap">{gig.description}</p>
    </div>
  );
}
