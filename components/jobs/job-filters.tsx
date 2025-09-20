'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { getCityOptions, getRegionOptions } from '@/lib/regions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const region = searchParams.get('region') ?? undefined;
  const city = searchParams.get('city') ?? undefined;

  const regionOptions = useMemo(() => getRegionOptions(), []);
  const cityOptions = useMemo(() => getCityOptions(region), [region]);

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full md:w-1/3">
        <Select
          value={region ?? ''}
          onValueChange={(value) => {
            updateParams({ region: value || undefined, city: undefined });
          }}
        >
          <SelectTrigger data-testid="filter-region" aria-label="Region filter">
            <SelectValue placeholder="Piliin ang Rehiyon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Lahat ng Rehiyon</SelectItem>
            {regionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/3">
        <Select
          value={city ?? ''}
          onValueChange={(value) => {
            updateParams({ city: value || undefined });
          }}
        >
          <SelectTrigger data-testid="filter-city" aria-label="City filter">
            <SelectValue placeholder="Piliin ang Lungsod" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Lahat ng Lungsod</SelectItem>
            {cityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
