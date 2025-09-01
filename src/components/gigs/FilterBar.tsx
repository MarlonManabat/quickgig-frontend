'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import GeoSelect, { GeoValue } from '@/components/location/GeoSelect';
import { getRegions } from '@/lib/psgc';

interface Props {
  q?: string;
  region?: string;
  sort?: 'new' | 'pay_high';
}

export default function FilterBar({ q = '', region = '', sort = 'new' }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(q);
  const [geo, setGeo] = useState<GeoValue>(() => {
    if (region) {
      const match = getRegions().find((r) => r.name === region);
      if (match) return { regionCode: match.code };
    }
    return {};
  });
  const [order, setSort] = useState(sort);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    const regionName = geo.regionCode
      ? getRegions().find((r) => r.code === geo.regionCode)?.name
      : '';
    if (regionName) params.set('region', regionName);
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
      <GeoSelect
        value={geo}
        onChange={setGeo}
        requireProvince={false}
        requireCityOrMunicipality={false}
        label="Region"
        className="min-w-[150px]"
      />
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
