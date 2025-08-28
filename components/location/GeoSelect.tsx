import { useEffect, useRef, useState } from 'react';
import {
  fetchRegions,
  fetchProvinces,
  fetchCities,
  type Region,
  type Province,
  type City,
} from '@/lib/geo';

export type GeoValue = {
  region: Region | null;
  province: Province | null;
  city: City | null;
};

export default function GeoSelect({
  value,
  onChange,
  isOnline,
  onLoadingChange,
}: {
  value: GeoValue;
  onChange: (v: GeoValue) => void;
  isOnline: boolean;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityWarning, setCityWarning] = useState(false);
  const cityRetry = useRef(false);

  const regionId = value.region?.id || '';
  const provinceId = value.province?.id || '';
  const cityId = value.city?.id || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchRegions();
        if (!cancelled) setRegions(data);
      } finally {
        if (!cancelled) setLoadingRegions(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!regionId) {
      setProvinces([]);
      setCities([]);
      if (value.province || value.city) onChange({ ...value, province: null, city: null });
      return;
    }
    setLoadingProvinces(true);
    onLoadingChange?.(true);
    fetchProvinces(regionId)
      .then((data) => {
        setProvinces(data);
        if (!data.find((p) => p.id === provinceId))
          onChange({ region: value.region, province: null, city: null });
      })
      .catch(() => setProvinces([]))
      .finally(() => {
        setLoadingProvinces(false);
      });
  }, [regionId]);

  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      if (value.city) onChange({ ...value, city: null });
      setCityWarning(false);
      cityRetry.current = false;
      return;
    }
    let cancelled = false;
    async function load() {
      setLoadingCities(true);
      onLoadingChange?.(true);
      try {
        const data = await fetchCities(provinceId);
        if (cancelled) return;
        setCities(data);
        if (!data.find((c) => c.id === cityId))
          onChange({ region: value.region, province: value.province, city: null });
        const isNCR =
          value.region?.name === 'National Capital Region' &&
          value.province?.name === 'Metro Manila';
        if (isNCR && data.length < 5 && !cityRetry.current) {
          setCityWarning(true);
          cityRetry.current = true;
          setTimeout(load, 500);
          return;
        }
        if (isNCR && data.length < 5) setCityWarning(true);
        else setCityWarning(false);
      } catch {
        if (!cancelled) setCities([]);
      } finally {
        if (!cancelled) setLoadingCities(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [provinceId, value.region, value.province]);

  useEffect(() => {
    const loading = loadingRegions || loadingProvinces || loadingCities;
    onLoadingChange?.(loading);
  }, [loadingRegions, loadingProvinces, loadingCities, onLoadingChange]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <select
        data-testid="region-select"
        className="border rounded p-2"
        value={regionId}
        onChange={(e) => {
          const r = regions.find((x) => x.id === e.target.value) || null;
          onChange({ region: r, province: null, city: null });
        }}
        disabled={isOnline}
        required={!isOnline}
      >
        <option value="">
          {loadingRegions ? 'Loading regions…' : 'Select Region'}
        </option>
        {regions.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <select
        data-testid="province-select"
        className="border rounded p-2"
        value={provinceId}
        onChange={(e) => {
          const p = provinces.find((x) => x.id === e.target.value) || null;
          onChange({ region: value.region, province: p, city: null });
        }}
        disabled={isOnline || !regionId}
        required={!isOnline}
      >
        <option value="">
          {!regionId
            ? 'Select Region first'
            : loadingProvinces
            ? 'Loading provinces…'
            : 'Select Province'}
        </option>
        {provinces.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        data-testid="city-select"
        className="border rounded p-2"
        value={cityId}
        onChange={(e) => {
          const c = cities.find((x) => x.id === e.target.value) || null;
          onChange({ region: value.region, province: value.province, city: c });
        }}
        disabled={isOnline || !provinceId}
      >
        <option value="">
          {!provinceId
            ? 'Select Province first'
            : loadingCities
            ? 'Loading cities…'
            : cities.length
            ? 'Select City'
            : 'No cities'}
        </option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      </div>
      {cityWarning && (
        <p className="text-xs text-orange-600" aria-live="polite">
          City list incomplete. Retrying…
        </p>
      )}
    </>
  );
}
