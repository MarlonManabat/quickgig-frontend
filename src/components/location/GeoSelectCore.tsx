"use client";

import { useMemo, useState } from "react";
import {
  ALL_REGIONS,
  DEFAULT_CITY,
  DEFAULT_PROVINCE,
  DEFAULT_REGION,
  citiesFor,
  provincesFor,
} from "@/lib/ph-geo";

export default function GeoSelectCore() {
  const [region, setRegion] = useState<string>(DEFAULT_REGION);
  const [province, setProvince] = useState<string>(DEFAULT_PROVINCE);
  const [city, setCity] = useState<string>(DEFAULT_CITY);

  const regions = useMemo(() => ALL_REGIONS, []);
  const provinces = useMemo(() => provincesFor(region), [region]);
  const cities = useMemo(() => citiesFor(region, province), [region, province]);

  return (
    <div className="mt-4 grid gap-3">
      <label className="block">
        <span className="text-sm">Region</span>
        <select
          aria-label="RegionSelect region"
          value={region}
          onChange={(event) => {
            const nextRegion = event.target.value;
            setRegion(nextRegion);
            setProvince("");
            setCity("");
          }}
        >
          <option value="">Select region</option>
          {regions.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm">Province</span>
        <select
          aria-label="ProvinceSelect province"
          value={province}
          onChange={(event) => {
            const nextProvince = event.target.value;
            setProvince(nextProvince);
            setCity("");
          }}
        >
          <option value="">Select province</option>
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
          aria-label="City / MunicipalitySelect city"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
          }}
        >
          <option value="">Select city</option>
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
