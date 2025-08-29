import React from 'react';
import locations from '@/data/ph_locations.json';

type Value = { region_code?: string; city_code?: string };

export default function LocationSelect({
  value,
  onChange,
  regionLabel = 'Select Region',
  cityLabel = 'Select City',
  className = ''
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
    // keep internal state in sync if parent resets
    setRegion(value?.region_code || '');
    setCity(value?.city_code || '');
  }, [value?.region_code, value?.city_code]);

  const cities = React.useMemo(
    () => locations.cities.filter(c => !region || c.region_code === region),
    [region]
  );

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      <select
        aria-label="Region"
        value={region}
        onChange={(e) => {
          const nextRegion = e.target.value;
          setRegion(nextRegion);
          setCity('');
          onChange({ region_code: nextRegion, city_code: '' });
        }}
        className="border rounded-xl p-2"
      >
        <option value="">{regionLabel}</option>
        {locations.regions.map(r => (
          <option key={r.code} value={r.code}>{r.name}</option>
        ))}
      </select>

      <select
        aria-label="City"
        value={city}
        onChange={(e) => {
          const nextCity = e.target.value;
          setCity(nextCity);
          onChange({ region_code: region, city_code: nextCity });
        }}
        className="border rounded-xl p-2"
        disabled={!region}
      >
        <option value="">
          {region ? cityLabel : 'Select Region First'}
        </option>
        {cities.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
