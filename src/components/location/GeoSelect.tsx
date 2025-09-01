'use client';

import { useMemo } from 'react';
import {
  getRegions,
  getProvincesByRegion,
  getMuncitiesByProvince,
  type Region, type Province, type CityOrMunicipality
} from '@/lib/psgc';

export type GeoValue = {
  regionCode?: string;
  provinceCode?: string;
  cityCode?: string;
  cityName?: string;
};

type Props = {
  label?: string;
  value: GeoValue;
  onChange: (v: GeoValue) => void;
  requireProvince?: boolean;
  requireCityOrMunicipality?: boolean;
  className?: string;
};

export default function GeoSelect({
  label = 'Lokasyon',
  value, onChange,
  requireProvince = true,
  requireCityOrMunicipality = true,
  className,
}: Props) {
  const regions: Region[] = useMemo(() => getRegions(), []);
  const provinces: Province[] = useMemo(
    () => (value.regionCode ? getProvincesByRegion(value.regionCode) : []),
    [value.regionCode]
  );
  const muncities: CityOrMunicipality[] = useMemo(
    () => (value.provinceCode ? getMuncitiesByProvince(value.provinceCode) : []),
    [value.provinceCode]
  );

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* Region */}
      <select
        className="w-full mb-2 border rounded-lg p-2"
        value={value.regionCode ?? ''}
        onChange={(e) =>
          onChange({ regionCode: e.target.value || undefined, provinceCode: undefined, cityCode: undefined, cityName: undefined })
        }
      >
        <option value="">— Piliin ang Rehiyon —</option>
        {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
      </select>

      {/* Province */}
      {requireProvince && (
        <select
          className="w-full mb-2 border rounded-lg p-2"
          disabled={!value.regionCode}
          value={value.provinceCode ?? ''}
          onChange={(e) =>
            onChange({ ...value, provinceCode: e.target.value || undefined, cityCode: undefined, cityName: undefined })
          }
        >
          <option value="">— Piliin ang Probinsya —</option>
          {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
        </select>
      )}

      {/* City / Municipality */}
      {requireCityOrMunicipality && (
        <select
          className="w-full border rounded-lg p-2"
          disabled={!value.provinceCode}
          value={value.cityCode ?? ''}
          onChange={(e) => {
            const cityCode = e.target.value || undefined;
            const name = muncities.find(x => x.code === cityCode)?.name;
            onChange({ ...value, cityCode, cityName: name });
          }}
        >
          <option value="">— Piliin ang Lungsod / Bayan —</option>
          {muncities.map(x => <option key={x.code} value={x.code}>{x.name}</option>)}
        </select>
      )}
    </div>
  );
}
