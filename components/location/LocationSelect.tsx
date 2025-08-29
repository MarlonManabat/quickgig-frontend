import React, { useEffect, useState } from 'react';
import {
  staticPhData,
  loadStaticPhData,
  Region,
  Province,
  City,
} from '@/lib/ph-data';

export interface LocationValue {
  regionCode: string | null;
  provinceCode: string | null;
  cityCode: string | null;
}

interface Props {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  disabled?: boolean;
  compact?: boolean;
}

const NCR_REGION_CODE = '130000000';
const NCR_PROVINCE_CODE = 'NCR';

export default function LocationSelect({ value, onChange, disabled, compact }: Props) {
  const [regions, setRegions] = useState<Region[]>(staticPhData.regions);
  const [provinces, setProvinces] = useState<Province[]>(staticPhData.provinces);
  const [cities, setCities] = useState<City[]>(staticPhData.cities);

  useEffect(() => {
    loadStaticPhData()
      .then((d) => {
        setRegions(d.regions);
        setProvinces(d.provinces);
        setCities(d.cities);
      })
      .catch(() => {});
  }, []);

  // hydrate from API when available
  useEffect(() => {
    fetch('/api/locations/regions')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) {
          setRegions((prev) => mergeByCode(prev, rows, 'region_code', 'region_name'));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!value.regionCode || value.regionCode === NCR_REGION_CODE) return;
    fetch(`/api/locations/provinces?region_id=${value.regionCode}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) {
          const mapped = rows.map((p: any) => ({
            region_code: value.regionCode!,
            province_code: p.id || p.code,
            province_name: p.name,
          }));
          setProvinces((prev) => mergeByCode(prev, mapped, 'province_code', 'province_name'));
        }
      })
      .catch(() => {});
  }, [value.regionCode]);

  useEffect(() => {
    if (!value.regionCode) return;
    if (value.regionCode === NCR_REGION_CODE) {
      fetch(`/api/locations/cities?region_id=${value.regionCode}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((rows) => {
          if (Array.isArray(rows) && rows.length) {
            const mapped = rows.map((c: any) => ({
              region_code: value.regionCode!,
              province_code: NCR_PROVINCE_CODE,
              city_code: c.id || c.code,
              city_name: c.name,
              is_city: true,
              is_municipality: false,
            }));
            setCities((prev) => mergeByCode(prev, mapped, 'city_code', 'city_name'));
          }
        })
        .catch(() => {});
      return;
    }
    if (!value.provinceCode) return;
    fetch(`/api/locations/cities?region_id=${value.regionCode}&province_id=${value.provinceCode}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) {
          const mapped = rows.map((c: any) => ({
            region_code: value.regionCode!,
            province_code: value.provinceCode!,
            city_code: c.id || c.code,
            city_name: c.name,
            is_city: true,
            is_municipality: false,
          }));
          setCities((prev) => mergeByCode(prev, mapped, 'city_code', 'city_name'));
        }
      })
      .catch(() => {});
  }, [value.regionCode, value.provinceCode]);

  function mergeByCode<T extends Record<string, any>>(base: T[], incoming: T[], codeKey: keyof T, nameKey: keyof T): T[] {
    const map = new Map<string, T>();
    base.forEach((b) => map.set(String(b[codeKey]), b));
    incoming.forEach((r) => map.set(String(r[codeKey]), r));
    return Array.from(map.values()).sort((a, b) => String(a[nameKey]).localeCompare(String(b[nameKey])));
  }

  const regionOpts = regions.sort((a, b) => a.region_name.localeCompare(b.region_name));
  const provinceOpts = value.regionCode === NCR_REGION_CODE
    ? provinces.filter((p) => p.province_code === NCR_PROVINCE_CODE)
    : provinces.filter((p) => p.region_code === value.regionCode).sort((a, b) => a.province_name.localeCompare(b.province_name));
  const cityOpts = value.regionCode === NCR_REGION_CODE
    ? cities.filter((c) => c.region_code === NCR_REGION_CODE)
    : cities.filter((c) => c.province_code === value.provinceCode);

  const layout = compact ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-1 sm:grid-cols-3 gap-2';

  return (
    <div className={layout}>
      <select
        data-testid="region-select"
        className="border rounded p-2"
        value={value.regionCode || ''}
        onChange={(e) => {
          const regionCode = e.target.value || null;
          onChange({ regionCode, provinceCode: null, cityCode: null });
        }}
        disabled={disabled}
      >
        <option value="">Select Region</option>
        {regionOpts.map((r) => (
          <option key={r.region_code} value={r.region_code}>{r.region_name}</option>
        ))}
      </select>

      {value.regionCode === NCR_REGION_CODE ? (
        <select className="border rounded p-2" value={NCR_PROVINCE_CODE} disabled>
          <option value={NCR_PROVINCE_CODE}>Metro Manila</option>
        </select>
      ) : (
        <select
          data-testid="province-select"
          className="border rounded p-2"
          value={value.provinceCode || ''}
          onChange={(e) => {
            const provinceCode = e.target.value || null;
            onChange({ regionCode: value.regionCode, provinceCode, cityCode: null });
          }}
          disabled={disabled ? true : !value.regionCode ? true : false}
        >
          <option value="">Select Province</option>
          {provinceOpts.map((p) => (
            <option key={p.province_code} value={p.province_code}>{p.province_name}</option>
          ))}
        </select>
      )}

      <select
        data-testid="city-select"
        className="border rounded p-2"
        value={value.cityCode || ''}
        onChange={(e) => {
          const cityCode = e.target.value || null;
          onChange({ regionCode: value.regionCode, provinceCode: value.provinceCode, cityCode });
        }}
        disabled={disabled || !value.regionCode || (value.regionCode !== NCR_REGION_CODE && !value.provinceCode)}
      >
        <option value="">Select City/Municipality</option>
        {cityOpts
          .sort((a, b) => a.city_name.localeCompare(b.city_name))
          .map((c) => (
            <option key={c.city_code} value={c.city_code}>{c.city_name}</option>
          ))}
      </select>
    </div>
  );
}
