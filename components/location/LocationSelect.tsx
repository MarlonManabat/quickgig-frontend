'use client';
import { useEffect, useMemo, useState } from 'react';
import { safeJson } from '@/lib/safeFetch';

export type LocationValue = { regionCode?: string; adminUnitCode?: string; cityCode?: string };

type Props = { value: LocationValue; onChange: (v: LocationValue) => void; disabled?: boolean };

export default function LocationSelect({ value, onChange, disabled }: Props) {
  const [regions, setRegions] = useState<any[]>([]);
  const [admins,  setAdmins ] = useState<any[]>([]);
  const [cities,  setCities ] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Minimal NCR fallback so UI never whitescreens
  const NCR = {
    regions:[{code:'NCR',name:'National Capital Region'}],
    admins:[{code:'NCR_METRO',name:'Metro Manila',regionCode:'NCR',type:'NCR_METRO'}],
    cities:[
      'Caloocan','Las Piñas','Makati','Malabon','Mandaluyong','Manila','Marikina','Muntinlupa',
      'Navotas','Parañaque','Pasay','Pasig','Quezon City','San Juan','Taguig','Valenzuela','Pateros'
    ].map((n,i)=>({code:`NCR_${i}`,name:n,adminUnitCode:'NCR_METRO',regionCode:'NCR',type:'CITY'})),
  };

  useEffect(() => {
    let dead = false;
    (async () => {
      const [r,a,c] = await Promise.all([
        safeJson<any[]>('/data/ph/regions.json', NCR.regions),
        safeJson<any[]>('/data/ph/admin_areas.json', NCR.admins),
        safeJson<any[]>('/data/ph/cities.json', NCR.cities),
      ]);
      if (dead) return;
      setRegions(r); setAdmins(a); setCities(c); setLoading(false);
    })();
    return () => { dead = true; };
  }, []);

  const regionAdmins = useMemo(
    () => admins.filter(u => u.regionCode === value.regionCode),
    [admins, value.regionCode]
  );

  const adminCities = useMemo(() => {
    const au = admins.find(u => u.code === value.adminUnitCode);
    if (!au) return [];
    if (au.type === 'HUC') return [{ code: au.code, name: au.name, adminUnitCode: au.code, regionCode: au.regionCode }];
    return cities.filter(c => c.adminUnitCode === value.adminUnitCode);
  }, [admins, cities, value.adminUnitCode]);

  const upd = (patch: Partial<LocationValue>) => onChange({ ...value, ...patch });

  return (
    <fieldset aria-busy={loading} className="grid gap-3" disabled={disabled}>
      <label>Region
        <select name="region" value={value.regionCode || ''} onChange={e => upd({ regionCode: e.target.value, adminUnitCode: undefined, cityCode: undefined })}>
          <option value="">Select Region</option>
          {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
      </label>

      <label>Province / Metro / HUC
        <select name="province" value={value.adminUnitCode || ''} disabled={!value.regionCode}
                onChange={e => upd({ adminUnitCode: e.target.value, cityCode: undefined })}>
          <option value="">Select Province / Metro / HUC</option>
          {regionAdmins.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
        </select>
      </label>

      <label>City / LGU
        <select name="city" value={value.cityCode || ''} disabled={!value.adminUnitCode}
                onChange={e => upd({ cityCode: e.target.value })}>
          <option value="">Select City</option>
          {adminCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </label>
    </fieldset>
  );
}
