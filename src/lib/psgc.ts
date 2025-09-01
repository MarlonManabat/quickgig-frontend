// Static PSGC wrapper (no barangays). Keeps forms DB/API-free.
import {
  listRegions,
  listProvinces,
  listMuncities, // municipalities + cities
  type Region as LibRegion,
  type Province as LibProvince,
  type Muncity as LibMuncity,
} from '@jobuntux/psgc';

const pad10 = (code: string) => code.padEnd(10, '0');

export type Region = { code: string; name: string };
export type Province = { code: string; name: string; regionCode: string };
export type CityOrMunicipality = {
  code: string; name: string; regionCode: string; provinceCode: string; isCity: boolean;
};

export function getRegions(): Region[] {
  return listRegions().map((r: LibRegion) => ({
    code: pad10(r.code.length === 2 ? r.code : r.code.slice(0, 2)),
    name: r.name,
  }));
}

export function getProvincesByRegion(regionCode: string): Province[] {
  const r2 = regionCode.slice(0, 2);
  return listProvinces(r2).map((p: LibProvince) => ({
    code: pad10(p.code.length >= 5 ? p.code.slice(0, 5) : p.code),
    name: p.name,
    regionCode: pad10(r2),
  }));
}

export function getMuncitiesByProvince(provinceCode: string): CityOrMunicipality[] {
  const p5 = provinceCode.slice(0, 5);
  return listMuncities(p5).map((m: LibMuncity) => ({
    code: pad10((m.code.length >= 5 ? m.code.slice(0, 5) : m.code)),
    name: m.name,
    regionCode: pad10(m.regionCode.slice(0, 2)),
    provinceCode: pad10(p5),
    isCity: /City/i.test(m.kind ?? '') || m.isCity === true,
  }));
}
