'use client';
import { useEffect } from 'react';
import useSWR from 'swr';
import toast from '@/utils/toast';

interface Value { region?: string; province?: string; city?: string }
interface Option { id: string; name: string }

const NCR_REGION_CODE = '130000000';

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
  const regions = useSWR<Option[]>('/api/locations/regions', fetcher, {
    dedupingInterval: 300000,
  });
  const provinces = useSWR<Option[]>(
    value.region && value.region !== NCR_REGION_CODE
      ? `/api/locations/provinces?region_id=${value.region}`
      : null,
    fetcher,
    { keepPreviousData: true, dedupingInterval: 300000 },
  );
  const cities = useSWR<Option[]>(
    value.region
      ? value.region === NCR_REGION_CODE
        ? `/api/locations/cities?region_id=${value.region}`
        : value.province
        ? `/api/locations/cities?region_id=${value.region}&province_id=${value.province}`
        : null
      : null,
    fetcher,
    { keepPreviousData: true, dedupingInterval: 300000 },
  );

  useEffect(() => {
    if (regions.error) toast.error("Couldn't load regions. Retry.");
    if (provinces.error) toast.error("Couldn't load provinces. Retry.");
    if (cities.error) toast.error("Couldn't load cities. Retry.");
  }, [regions.error, provinces.error, cities.error]);

  const regionOptions = regions.data
    ? [...regions.data].sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const provinceOptions = provinces.data
    ? [...provinces.data].sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const cityOptions = cities.data
    ? [...cities.data].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const renderSkeleton = () => (
    <div className="h-10 bg-gray-200 rounded animate-pulse" />
  );

  const canSelectCity =
    !!value.region &&
    (value.region === NCR_REGION_CODE || !!value.province);

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
              onChange({ region: r });
            }}
            required={required}
          >
            <option value="">Select Region</option>
            {regionOptions.map((r) => (
              <option key={r.id} value={r.id}>
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

      {value.region && value.region !== NCR_REGION_CODE && (
        <div>
          <label htmlFor="sel-province" className="block text-sm mb-1">
            Province
          </label>
          {provinceOptions ? (
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
              required={required}
            >
              <option value="">Select Province</option>
              {provinceOptions.map((p) => (
                <option key={p.id} value={p.id}>
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
          ) : (
            renderSkeleton()
          )}
        </div>
      )}

      <div>
        <label htmlFor="sel-city" className="block text-sm mb-1">
          City
        </label>
        {canSelectCity && cityOptions ? (
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
            disabled={!canSelectCity}
            required={required}
          >
            <option value="">Select City</option>
            {cityOptions.map((c) => (
              <option key={c.id} value={c.id}>
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
        ) : canSelectCity ? (
          renderSkeleton()
        ) : (
          renderSkeleton()
        )}
      </div>
    </div>
  );
}
