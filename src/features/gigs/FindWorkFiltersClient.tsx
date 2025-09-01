'use client';

import { useState, useEffect } from 'react';
import GeoSelect, { type GeoValue } from '@/components/location/GeoSelect';

type Props = {
  onChange?: (params: URLSearchParams) => void;
};

export default function FindWorkFiltersClient({ onChange }: Props) {
  const [geo, setGeo] = useState<GeoValue>({});

  useEffect(() => {
    const qp = new URLSearchParams();
    if (geo.regionCode) qp.set('region', geo.regionCode);
    if (geo.provinceCode) qp.set('province', geo.provinceCode);
    if (geo.cityCode) qp.set('city', geo.cityCode);
    onChange?.(qp);
  }, [geo, onChange]);

  return (
    <div className="space-y-2">
      <GeoSelect value={geo} onChange={setGeo} />
    </div>
  );
}
