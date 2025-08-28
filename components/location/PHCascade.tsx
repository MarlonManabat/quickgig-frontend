'use client';
import { useEffect } from 'react';
import useSWR from 'swr';
import toast from '@/utils/toast';

interface Value { region?: string; province?: string; city?: string }
interface Option { code: string; name: string }

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('failed');
  return res.json();
};

export default function PHCascade({
  value,
  onChange,
  required,
}: {
  value: Value;
  onChange: (v: Value) => void;
  required?: boolean;
}) {
  const regions = useSWR('/api/locations/regions', fetcher, {
    dedupingInterval: 300000,
  });
  const provinces = useSWR(
    value.region && value.region !== 'NCR'
      ? `/api/locations/provinces?region=${value.region}`
      : null,
    fetcher,
    { keepPreviousData: true, dedupingInterval: 300000 },
  );
  const cities = useSWR(
    value.province ? `/api/locations/cities?province=${value.province}` : null,
    fetcher,
    { keepPreviousData: true, dedupingInterval: 300000 },
  );

  useEffect(() => {
    if (regions.error) toast.error("Couldn't load regions. Retry.");
    if (provinces.error) toast.error("Couldn't load provinces. Retry.");
    if (cities.error) toast.error("Couldn't load cities. Retry.");
  }, [regions.error, provinces.error, cities.error]);

  const regionOptions = regions.data?.regions
    ? [...regions.data.regions].sort((a: Option, b: Option) =>
        a.name.localeCompare(b.name),
      )
    : [];
  const provinceOptions =
    value.region === 'NCR'
      ? [{ code: 'NCR', name: 'NCR' }]
      : provinces.data?.provinces
      ? [...provinces.data.provinces].sort((a: Option, b: Option) =>
          a.name.localeCompare(b.name),
        )
      : [];
  const cityOptions = cities.data?.cities
    ? [...cities.data.cities].sort((a: Option, b: Option) =>
        a.name.localeCompare(b.name),
      )
    : [];

  const renderSkeleton = () => (
    <div className="h-10 bg-gray-200 rounded animate-pulse" />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div>
        <label htmlFor="sel-region" className="block text-sm mb-1">
          Region
        </label>
        {regions.data ? (
          <select
            id="sel-region"
            data-testid="sel-region"
            className="border rounded p-2 w-full"
            value={value.region || ''}
            onChange={(e) => {
              const r = e.target.value || undefined;
              if (r === 'NCR') onChange({ region: r, province: 'NCR' });
              else onChange({ region: r });
            }}
            required={required}
          >
            <option value="">Select Region</option>
            {regionOptions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        ) : regions.error ? (
          <div className="text-sm text-red-600" aria-live="polite">
            Failed to load regions.{' '}
            <button
              type="button"
              className="underline"
              onClick={() => regions.mutate()}
            >
              Retry
            </button>
          </div>
        ) : (
          renderSkeleton()
        )}
      </div>

      <div>
        <label htmlFor="sel-province" className="block text-sm mb-1">
          Province
        </label>
        {value.region && provinceOptions ? (
          <select
            id="sel-province"
            data-testid="sel-province"
            className="border rounded p-2 w-full"
            value={value.province || ''}
            onChange={(e) =>
              onChange({
                region: value.region,
                province: e.target.value || undefined,
              })
            }
            disabled={!value.region || value.region === 'NCR'}
            required={required}
          >
            <option value="">Select Province</option>
            {provinceOptions.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        ) : provinces.error ? (
          <div className="text-sm text-red-600" aria-live="polite">
            Failed to load provinces.{' '}
            <button
              type="button"
              className="underline"
              onClick={() => provinces.mutate()}
            >
              Retry
            </button>
          </div>
        ) : value.region ? (
          renderSkeleton()
        ) : (
          renderSkeleton()
        )}
      </div>

      <div>
        <label htmlFor="sel-city" className="block text-sm mb-1">
          City
        </label>
        {value.province && cityOptions ? (
          <select
            id="sel-city"
            data-testid="sel-city"
            className="border rounded p-2 w-full"
            value={value.city || ''}
            onChange={(e) =>
              onChange({
                region: value.region,
                province: value.province,
                city: e.target.value || undefined,
              })
            }
            disabled={!value.province}
            required={required}
          >
            <option value="">Select City</option>
            {cityOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        ) : cities.error ? (
          <div className="text-sm text-red-600" aria-live="polite">
            Failed to load cities.{' '}
            <button
              type="button"
              className="underline"
              onClick={() => cities.mutate()}
            >
              Retry
            </button>
          </div>
        ) : value.province ? (
          renderSkeleton()
        ) : (
          renderSkeleton()
        )}
      </div>
    </div>
  );
}
