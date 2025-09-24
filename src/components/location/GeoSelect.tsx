"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getRegions,
  getProvincesByRegion,
  getMuncitiesByProvince,
  type Region,
  type Province,
  type CityOrMunicipality,
} from "@/lib/psgc";

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

type FallbackData = {
  regions: Region[];
  provincesByRegion: Record<string, Province[]>;
  muncitiesByProvince: Record<string, CityOrMunicipality[]>;
};

export default function GeoSelect({
  label = "Lokasyon",
  value,
  onChange,
  requireProvince = true,
  requireCityOrMunicipality = true,
  className,
}: Props) {
  const [fallbackData, setFallbackData] = useState<FallbackData | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFallback() {
      try {
        const [regionsRes, provincesRes, citiesRes] = await Promise.all([
          fetch("/data/ph/regions.json", { cache: "force-cache" }),
          fetch("/data/ph/provinces.json", { cache: "force-cache" }),
          fetch("/data/ph/cities.json", { cache: "force-cache" }),
        ]);

        if (!regionsRes.ok || !provincesRes.ok || !citiesRes.ok) {
          return;
        }

        const [regionsJson, provincesJson, citiesJson] = await Promise.all([
          regionsRes.json(),
          provincesRes.json(),
          citiesRes.json(),
        ]);

        if (!active) return;

        type RegionEntry = { region_code: string; region_name: string };
        type ProvinceEntry = {
          region_code: string;
          province_code: string;
          province_name: string;
        };
        type CityEntry = {
          region_code: string;
          province_code: string;
          city_code: string;
          city_name: string;
          is_city?: boolean;
        };

        const mappedRegions: Region[] = (regionsJson as RegionEntry[]).map((entry) => ({
          code: entry.region_code,
          name: entry.region_name,
        }));

        const provincesByRegion: Record<string, Province[]> = {};
        (provincesJson as ProvinceEntry[]).forEach((entry) => {
          const province: Province = {
            code: entry.province_code,
            name: entry.province_name,
            regionCode: entry.region_code,
          };
          if (!provincesByRegion[province.regionCode]) {
            provincesByRegion[province.regionCode] = [];
          }
          provincesByRegion[province.regionCode].push(province);
        });

        const muncitiesByProvince: Record<string, CityOrMunicipality[]> = {};
        (citiesJson as CityEntry[]).forEach((entry) => {
          const city: CityOrMunicipality = {
            code: entry.city_code,
            name: entry.city_name,
            regionCode: entry.region_code,
            provinceCode: entry.province_code,
            isCity: Boolean(entry.is_city),
          };
          if (!muncitiesByProvince[city.provinceCode]) {
            muncitiesByProvince[city.provinceCode] = [];
          }
          muncitiesByProvince[city.provinceCode].push(city);
        });

        const compareByName = <T extends { name: string }>(a: T, b: T) =>
          a.name.localeCompare(b.name, "en", { sensitivity: "base" });

        mappedRegions.sort(compareByName);
        Object.values(provincesByRegion).forEach((list) => list.sort(compareByName));
        Object.values(muncitiesByProvince).forEach((list) => list.sort(compareByName));

        setFallbackData({
          regions: mappedRegions,
          provincesByRegion,
          muncitiesByProvince,
        });
      } catch {
        // Best-effort fallback only.
      }
    }

    loadFallback();

    return () => {
      active = false;
    };
  }, []);

  const baseRegions: Region[] = useMemo(() => getRegions(), []);
  const baseProvinces: Province[] = useMemo(
    () => (value.regionCode ? getProvincesByRegion(value.regionCode) : []),
    [value.regionCode],
  );
  const baseMuncities: CityOrMunicipality[] = useMemo(
    () => (value.provinceCode ? getMuncitiesByProvince(value.provinceCode) : []),
    [value.provinceCode],
  );

  const regions = useMemo(() => {
    const merged = new Map<string, Region>();
    baseRegions.forEach((region) => merged.set(region.code, region));
    fallbackData?.regions.forEach((region) => {
      if (!merged.has(region.code)) merged.set(region.code, region);
    });
    return Array.from(merged.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
    );
  }, [baseRegions, fallbackData?.regions]);

  const provinces = useMemo(() => {
    const merged = new Map<string, Province>();
    baseProvinces.forEach((province) => merged.set(province.code, province));
    if (value.regionCode) {
      fallbackData?.provincesByRegion[value.regionCode]?.forEach((province) => {
        if (!merged.has(province.code)) merged.set(province.code, province);
      });
    }
    return Array.from(merged.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
    );
  }, [baseProvinces, fallbackData?.provincesByRegion, value.regionCode]);

  const muncities = useMemo(() => {
    const merged = new Map<string, CityOrMunicipality>();
    baseMuncities.forEach((city) => merged.set(city.code, city));
    if (value.provinceCode) {
      fallbackData?.muncitiesByProvince[value.provinceCode]?.forEach((city) => {
        if (!merged.has(city.code)) merged.set(city.code, city);
      });
    }
    return Array.from(merged.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
    );
  }, [baseMuncities, fallbackData?.muncitiesByProvince, value.provinceCode]);

  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">{label}</label>

      {/* Region */}
      <select
        className="mb-2 w-full rounded-lg border p-2"
        value={value.regionCode ?? ""}
        onChange={(e) =>
          onChange({
            regionCode: e.target.value || undefined,
            provinceCode: undefined,
            cityCode: undefined,
            cityName: undefined,
          })
        }
      >
        <option value="">— Piliin ang Rehiyon —</option>
        {regions.map((region) => (
          <option key={region.code} value={region.code}>
            {region.name}
          </option>
        ))}
      </select>

      {/* Province */}
      {requireProvince && (
        <select
          className="mb-2 w-full rounded-lg border p-2"
          disabled={!value.regionCode}
          value={value.provinceCode ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              provinceCode: e.target.value || undefined,
              cityCode: undefined,
              cityName: undefined,
            })
          }
        >
          <option value="">— Piliin ang Probinsya —</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      )}

      {/* City / Municipality */}
      {requireCityOrMunicipality && (
        <select
          className="w-full rounded-lg border p-2"
          disabled={!value.provinceCode}
          value={value.cityCode ?? ""}
          onChange={(e) => {
            const cityCode = e.target.value || undefined;
            const name = muncities.find((entry) => entry.code === cityCode)?.name;
            onChange({ ...value, cityCode, cityName: name });
          }}
        >
          <option value="">— Piliin ang Lungsod / Bayan —</option>
          {muncities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
