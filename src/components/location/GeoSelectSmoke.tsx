"use client";

import { useMemo, useState } from "react";
import rowsJson from "@/data/ph/cities.json";

type Row = { region: string; province?: string; city: string };

export default function GeoSelectSmoke() {
  const rows: Row[] = Array.isArray(rowsJson) ? (rowsJson as Row[]) : [];
  const seeded = rows.find((entry) => /quezon city/i.test(entry.city));
  const [region, setRegion] = useState<string>(seeded?.region ?? "");
  const [province, setProvince] = useState<string>(seeded?.province ?? "");
  const [city, setCity] = useState<string>(seeded ? "Quezon City" : "");

  const regions = useMemo(
    () => Array.from(new Set(rows.map((entry) => entry.region))).sort(),
    [rows],
  );
  const provinces = useMemo(() => {
    const filtered = rows.filter((entry) => !region || entry.region === region);
    return Array.from(new Set(filtered.map((entry) => entry.province || "")))
      .filter(Boolean)
      .sort();
  }, [rows, region]);
  const cities = useMemo(() => {
    const filtered = rows.filter(
      (entry) =>
        (!region || entry.region === region) && (!province || (entry.province || "") === province),
    );
    return Array.from(new Set(filtered.map((entry) => entry.city))).sort();
  }, [rows, region, province]);

  return (
    <div className="mt-4 grid gap-3">
      <label className="block">
        <span className="text-sm">Region</span>
        <select
          value={region}
          onChange={(event) => {
            setRegion(event.target.value);
            setProvince("");
            setCity("");
          }}
        >
          <option value="">Select region</option>
          {regions.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm">Province</span>
        <select
          value={province}
          onChange={(event) => {
            setProvince(event.target.value);
            setCity("");
          }}
        >
          <option value="">Select province</option>
          {provinces.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm">City / Municipality</span>
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="">Select city</option>
          {cities.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
