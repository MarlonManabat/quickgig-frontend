import FilterBar from '@/components/gigs/FilterBar';
import GigCard from '@/components/gigs/GigCard';
import Empty from '@/components/gigs/Empty';
import type { GigsQuery, GigsResponse } from '@/types/gigs';
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function getOrigin() {
  const h = headers();
  const protocol = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('host');
  if (host) return `${protocol}://${host}`;
  return process.env.NEXT_PUBLIC_APP_ORIGIN || '';
}

async function fetchGigs(params: GigsQuery): Promise<GigsResponse> {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.region) qs.set('region', params.region);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  const url = `${getOrigin()}/api/gigs?${qs.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load gigs');
  }
  return (await res.json()) as GigsResponse;
}

export default async function GigsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const region =
    typeof searchParams.region === 'string' ? searchParams.region : undefined;
  const sort =
    typeof searchParams.sort === 'string'
      ? (searchParams.sort as 'new' | 'pay_high')
      : undefined;
  const page = parseInt(
    typeof searchParams.page === 'string' ? searchParams.page : '1',
    10,
  );
  const limit = parseInt(
    typeof searchParams.limit === 'string' ? searchParams.limit : '10',
    10,
  );

  const data = await fetchGigs({ q, region, sort, page, limit });
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));
  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (region) params.set('region', region);
    if (sort) params.set('sort', sort);
    params.set('page', String(p));
    params.set('limit', String(limit));
    const qs = params.toString();
    return `/gigs${qs ? `?${qs}` : ''}`;
  };

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      <FilterBar q={q} region={region} sort={sort} />
      {data.items.length === 0 ? (
        <Empty />
      ) : (
        <ul className="grid gap-4">
          {data.items.map((g) => (
            <GigCard key={g.id} gig={g} />
          ))}
        </ul>
      )}
      <nav className="flex items-center justify-between">
        <Link
          href={makeHref(Math.max(1, data.page - 1))}
          aria-disabled={data.page <= 1}
          className={`rounded border px-3 py-1 ${
            data.page <= 1 ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          Prev
        </Link>
        <span>
          Page {data.page} of {totalPages}
        </span>
        <Link
          href={makeHref(Math.min(totalPages, data.page + 1))}
          aria-disabled={data.page >= totalPages}
          className={`rounded border px-3 py-1 ${
            data.page >= totalPages ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          Next
        </Link>
      </nav>
    </main>
  );
}
