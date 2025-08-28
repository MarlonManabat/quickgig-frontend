'use client';
import useSWR from 'swr';
import { useEffect } from 'react';

type Opt = { code: string; name: string };

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function PHCascade({
  value,
  onChange,
  required,
}: {
  value?: { region?: string; province?: string; city?: string };
  onChange: (v: { region?: string; province?: string; city?: string }) => void;
  required?: boolean;
}) {
  const { data: regions } = useSWR<Opt[]>('/api/locations/regions', fetcher);

  const { data: provinces } = useSWR<Opt[]>(
    value?.region ? `/api/locations/provinces?region=${value.region}` : null,
    fetcher
  );

  const { data: cities } = useSWR<Opt[]>(
    value?.province ? `/api/locations/cities?province=${value.province}` : null,
    fetcher
  );

  useEffect(() => {
    onChange({ region: value?.region, province: value?.province, city: value?.city });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setRegion(code: string) {
    onChange({ region: code || undefined, province: undefined, city: undefined });
  }
  function setProvince(code: string) {
    onChange({ region: value?.region, province: code || undefined, city: undefined });
  }
  function setCity(code: string) {
    onChange({ region: value?.region, province: value?.province, city: code || undefined });
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <select
        data-testid="sel-region"
        className="border rounded p-2 w-full"
        value={value?.region || ''}
        onChange={(e) => setRegion(e.target.value)}
        required={required}
      >
        <option value="">Select region</option>
        {(regions || []).map((r) => (
          <option key={r.code} value={r.code}>
            {r.name}
          </option>
        ))}
      </select>

      <select
        data-testid="sel-province"
        className="border rounded p-2 w-full"
        value={value?.province || ''}
        onChange={(e) => setProvince(e.target.value)}
        disabled={!provinces}
        required={required}
      >
        <option value="">
          {provinces ? 'Select province' : 'Select region first'}
        </option>
        {(provinces || []).map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        data-testid="sel-city"
        className="border rounded p-2 w-full"
        value={value?.city || ''}
        onChange={(e) => setCity(e.target.value)}
        disabled={!cities}
        required={required}
      >
        <option value="">
          {cities ? 'Select city/municipality' : 'Select province first'}
        </option>
        {(cities || []).map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
