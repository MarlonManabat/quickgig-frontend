"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ALL_REGIONS,
  DEFAULT_CITY,
  DEFAULT_PROVINCE,
  DEFAULT_REGION,
  citiesFor,
  provincesFor,
} from "@/lib/ph-geo";

function setParam(params: URLSearchParams, key: string, value?: string | null) {
  if (value && value.trim() !== "") {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

function getFirst(value: string | string[] | null): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

interface LocationFiltersProps {
  onFilterChange?: (region: string, province: string, city: string) => void;
}

export default function LocationFilters({ onFilterChange }: LocationFiltersProps = {}) {
  const pathname = usePathname() ?? "/browse-jobs";
  const params = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const hasRegionParam = params.has("region");
  const hasProvinceParam = params.has("province");
  const hasCityParam = params.has("city");

  const rawRegion = getFirst(params.get("region"));
  const rawProvince = getFirst(params.get("province"));
  const rawCity = getFirst(params.get("city"));

  const initialRegion = hasRegionParam ? rawRegion ?? "" : "";
  const initialProvince = hasProvinceParam ? rawProvince ?? "" : "";
  const initialCity = hasCityParam ? rawCity ?? "" : "";

  // Use local state for immediate updates
  const [region, setRegion] = useState(initialRegion);
  const [province, setProvince] = useState(initialProvince);
  const [city, setCity] = useState(initialCity);

  const provinces = useMemo(() => provincesFor(region), [region]);
  const cities = useMemo(() => citiesFor(region, province), [region, province]);

  // Notify parent on initial mount and when filters change
  useEffect(() => {
    if (onFilterChange) {
      console.log('[LocationFilters] Initial filter state:', { region, province, city });
      onFilterChange(region, province, city);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (next: { region?: string; province?: string; city?: string }) => {
    const search = new URLSearchParams(params.toString());
    const nextRegion = next.region ?? region;
    const nextProvince =
      next.province ?? (next.region !== undefined ? "" : province);
    const nextCity = next.city ?? (next.province !== undefined ? "" : city);

    setParam(search, "region", nextRegion);
    setParam(search, "province", nextProvince);
    setParam(search, "city", nextCity);

    const query = search.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const handleRegionChange = (value: string) => {
    const newRegion = value;
    const newProvince = ""; // Reset province when region changes
    const newCity = ""; // Reset city when region changes
    
    setRegion(newRegion);
    setProvince(newProvince);
    setCity(newCity);
    
    // Call onFilterChange immediately with new values
    if (onFilterChange) {
      console.log('[LocationFilters] Region changed, calling onFilterChange with:', { region: newRegion, province: newProvince, city: newCity });
      onFilterChange(newRegion, newProvince, newCity);
    }
    
    if (!onFilterChange) {
      navigate({ region: newRegion });
    }
  };

  const handleProvinceChange = (value: string) => {
    const newProvince = value;
    const newCity = ""; // Reset city when province changes
    
    setProvince(newProvince);
    setCity(newCity);
    
    // Call onFilterChange immediately with new values
    if (onFilterChange) {
      console.log('[LocationFilters] Province changed, calling onFilterChange with:', { region, province: newProvince, city: newCity });
      onFilterChange(region, newProvince, newCity);
    }
    
    if (!onFilterChange) {
      navigate({ province: newProvince });
    }
  };

  const handleCityChange = (value: string) => {
    const newCity = value;
    
    setCity(newCity);
    
    // Call onFilterChange immediately with new values
    if (onFilterChange) {
      console.log('[LocationFilters] City changed, calling onFilterChange with:', { region, province, city: newCity });
      onFilterChange(region, province, newCity);
    }
    
    if (!onFilterChange) {
      navigate({ city: newCity });
    }
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <label className="block">
        <span className="text-sm">Region</span>
        <select
          data-testid="filter-region"
          aria-label="FilterRegion"
          value={region}
          onChange={(event) => handleRegionChange(event.target.value)}
        >
          <option value="">All regions</option>
          {ALL_REGIONS.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm">Province</span>
        <select
          data-testid="filter-province"
          aria-label="FilterProvince"
          value={province}
          onChange={(event) => handleProvinceChange(event.target.value)}
          disabled={!region}
        >
          <option value="">All provinces</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm">City / Municipality</span>
        <select
          data-testid="filter-city"
          aria-label="FilterCity"
          value={city}
          onChange={(event) => handleCityChange(event.target.value)}
          disabled={!region}
        >
          <option value="">All cities</option>
          {cities.map((cty) => (
            <option key={cty} value={cty}>
              {cty}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

