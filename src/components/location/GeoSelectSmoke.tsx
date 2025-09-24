"use client";

import { useEffect, useMemo, useState } from "react";

type Row = { region: string; province?: string; city: string };

export default function GeoSelectSmoke() {
  const [rows, setRows] = useState<Row[]>([]);
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/data/ph/cities.json", { cache: "force-cache" });
        if (!res.ok) return;
        const json = await res.json();
        if (alive) {
          setRows(Array.isArray(json) ? json : []);
        }
      } catch {
        // ignore network issues in smoke environments
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.region))).sort(),
    [rows],
  );
  const provinces = useMemo(() => {
    const filtered = rows.filter((r) => !region || r.region === region);
    return Array.from(new Set(filtered.map((r) => r.province || "")))
      .filter(Boolean)
      .sort();
  }, [rows, region]);
  const cities = useMemo(() => {
    const filtered = rows.filter(
      (r) => (!region || r.region === region) && (!province || (r.province || "") === province),
    );
    return Array.from(new Set(filtered.map((r) => r.city))).sort();
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
