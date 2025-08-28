'use client';
import useSWR from 'swr';

interface Value { region?: string; province?: string; city?: string }
interface Option { code: string; name: string }

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PHCascade({ value, onChange, required }:{ value: Value; onChange:(v:Value)=>void; required?: boolean }) {
  const { data: regions } = useSWR('/api/locations/regions', fetcher);
  const { data: provinces } = useSWR(value.region ? `/api/locations/provinces?region=${value.region}` : null, fetcher);
  const { data: cities } = useSWR(value.province ? `/api/locations/cities?province=${value.province}` : null, fetcher);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <select
        data-testid="region-select"
        className="border rounded p-2"
        value={value.region || ''}
        onChange={(e) => onChange({ region: e.target.value || undefined })}
        required={required}
      >
        <option value="">Select Region</option>
        {regions?.regions?.map((r: Option) => (
          <option key={r.code} value={r.code}>{r.name}</option>
        ))}
      </select>

      <select
        data-testid="province-select"
        className="border rounded p-2"
        value={value.province || ''}
        onChange={(e) => onChange({ region: value.region, province: e.target.value || undefined })}
        disabled={!value.region}
        required={required}
      >
        <option value="">{!value.region ? 'Select Region first' : 'Select Province'}</option>
        {provinces?.provinces?.map((p: Option) => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <select
        data-testid="city-select"
        className="border rounded p-2"
        value={value.city || ''}
        onChange={(e) => onChange({ region: value.region, province: value.province, city: e.target.value || undefined })}
        disabled={!value.province}
        required={required}
      >
        <option value="">{!value.province ? 'Select Province first' : 'Select City'}</option>
        {cities?.cities?.map((c: Option) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
