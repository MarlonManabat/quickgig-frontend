import React from 'react';
import { getRegions, getCitiesByRegion } from '@/lib/locations';

type Value = { region_code?: string; city_code?: string };

export default function LocationSelect({
  value, onChange, regionLabel = 'Select Region', cityLabel = 'Select City', className = ''
}: {
  value?: Value;
  onChange: (v: Value) => void;
  regionLabel?: string;
  cityLabel?: string;
  className?: string;
}) {
  const [region, setRegion] = React.useState(value?.region_code || '');
  const [city, setCity] = React.useState(value?.city_code || '');

  React.useEffect(() => {
    setRegion(value?.region_code || '');
    setCity(value?.city_code || '');
  }, [value?.region_code, value?.city_code]);

  const regions = React.useMemo(() => getRegions(), []);
  const cities  = React.useMemo(() => getCitiesByRegion(region), [region]);

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      <select
        aria-label="Region"
        value={region}
        onChange={(e) => {
          const next = e.target.value;
          setRegion(next);
          setCity('');
          onChange({ region_code: next, city_code: '' });
        }}
        className="border rounded-xl p-2"
      >
        <option value="">{regionLabel}</option>
        {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
      </select>

      <select
        aria-label="City"
        value={city}
        onChange={(e) => {
          const next = e.target.value;
          setCity(next);
          onChange({ region_code: region, city_code: next });
        }}
        className="border rounded-xl p-2"
        disabled={!region}
      >
        <option value="">{region ? cityLabel : 'Select Region First'}</option>
        {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>
    </div>
  );
}
