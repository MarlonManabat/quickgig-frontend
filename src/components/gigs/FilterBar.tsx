'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import regionsData from '../../../public/data/ph/regions.json';

interface Region {
  region_code: string;
  region_name: string;
}
const REGIONS = regionsData as Region[];

interface Props {
  q?: string;
  region?: string;
  sort?: 'new' | 'pay_high';
}

export default function FilterBar({ q = '', region = '', sort = 'new' }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(q);
  const [reg, setRegion] = useState(region);
  const [order, setSort] = useState(sort);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (reg) params.set('region', reg);
    if (order && order !== 'new') params.set('sort', order);
    params.set('page', '1');
    const qs = params.toString();
    router.replace(`/gigs${qs ? `?${qs}` : ''}`);
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 flex flex-wrap gap-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search gigs"
        className="flex-1 min-w-[150px] rounded border p-2"
      />
      <select
        value={reg}
        onChange={(e) => setRegion(e.target.value)}
        className="rounded border p-2"
      >
        <option value="">All regions</option>
        {REGIONS.map((r) => (
          <option key={r.region_code} value={r.region_name}>
            {r.region_name}
          </option>
        ))}
      </select>
      <select
        value={order}
        onChange={(e) => setSort(e.target.value as 'new' | 'pay_high')}
        className="rounded border p-2"
      >
        <option value="new">Newest</option>
        <option value="pay_high">Highest pay</option>
      </select>
      <button type="submit" className="rounded border px-4 py-2">
        Apply
      </button>
    </form>
  );
}
