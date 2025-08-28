export type Region = { id: string; code: string; name: string };
export type Province = { id: string; name: string; regionCode: string };
export type City = { id: string; name: string; provinceId: string };

const warned: Record<string, boolean> = {};
function warnOnce(source: string, err: unknown) {
  if (!warned[source]) {
    console.warn(`[geo] ${source} failed`, err);
    warned[source] = true;
  }
}

export async function withTimeout<T>(p: Promise<T>, ms = 2500, label = ''): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms${label ? ` [${label}]` : ''}`));
    }, ms);
  });

  try {
    // race the real promise against the timeout
    return await Promise.race([p, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function fetchSupabase(path: string, signal?: AbortSignal) {
  const env = supabaseEnv();
  if (!env) throw new Error('supabase env missing');
  const { url, key } = env;
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal,
  });
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  return res.json();
}

async function loadStaticJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

function validateRegions(data: any): Region[] {
  return Array.isArray(data)
    ? data
        .filter(
          (r: any) => r && typeof r.code === 'string' && typeof r.name === 'string',
        )
        .map((r: any) => ({ id: r.code, code: r.code, name: r.name }))
    : [];
}

function validateProvinces(data: any, regionCode: string): Province[] {
  const rows = Array.isArray(data)
    ? data.filter(
        (p: any) => p && typeof p.code === 'string' && typeof p.name === 'string',
      )
    : [];
  return rows.map((p: any) => ({ id: p.code, name: p.name, regionCode }));
}

function validateCities(data: any, provinceId: string): City[] {
  const rows = Array.isArray(data)
    ? data.filter(
        (c: any) => c && typeof c.code === 'string' && typeof c.name === 'string',
      )
    : [];
  return rows.map((c: any) => ({ id: c.code, name: c.name, provinceId }));
}

export async function fetchRegions(opts?: { signal?: AbortSignal }): Promise<Region[]> {
  const signal = opts?.signal;
  // Supabase
  try {
    const data = await withTimeout(
      fetchSupabase('ph_regions?select=code,name&order=name', signal),
      2500,
      'regions supabase',
    );
    const rows = validateRegions(data);
    if (rows.length) return rows;
  } catch (err) {
    warnOnce('supabase regions', err);
  }
  // API
  try {
    const res = await withTimeout(
      fetch('/api/locations/regions', { signal }).then((r) => r.json()),
      2500,
      'regions api',
    );
    const rows = validateRegions(res.regions);
    if (rows.length) return rows;
  } catch (err) {
    warnOnce('api regions', err);
  }
  // Static
  const data = await withTimeout(
    loadStaticJSON<Region[]>('/geo/ph/regions.json'),
    2500,
    'regions static',
  );
  return validateRegions(data);
}

export async function fetchProvinces(
  regionCode: string,
  opts?: { signal?: AbortSignal },
): Promise<Province[]> {
  const signal = opts?.signal;
  // Supabase
  try {
    const data = await withTimeout(
      fetchSupabase(
        `ph_provinces?select=code,name,region_code&region_code=eq.${encodeURIComponent(
          regionCode,
        )}&order=name`,
        signal,
      ),
      2500,
      'provinces supabase',
    );
    const rows = validateProvinces(data, regionCode);
    if (rows.length) return rows;
  } catch (err) {
    warnOnce('supabase provinces', err);
  }
  // API
  try {
    const res = await withTimeout(
      fetch(`/api/locations/provinces?region=${regionCode}`, { signal }).then((r) =>
        r.json(),
      ),
      2500,
      'provinces api',
    );
    const rows = validateProvinces(res.provinces, regionCode);
    if (rows.length) return rows;
  } catch (err) {
    warnOnce('api provinces', err);
  }
  // Static
  const data = await withTimeout(
    loadStaticJSON<Province[]>(`/geo/ph/provinces.json`),
    2500,
    'provinces static',
  );
  return validateProvinces(data, regionCode);
}

export async function fetchCities(
  provinceId: string,
  opts?: { signal?: AbortSignal },
): Promise<City[]> {
  const signal = opts?.signal;
  // Supabase
  try {
    const data = await withTimeout(
      fetchSupabase(
        `ph_cities?select=code,name,province_code&province_code=eq.${encodeURIComponent(
          provinceId,
        )}&order=name`,
        signal,
      ),
      2500,
      'cities supabase',
    );
    const rows = validateCities(data, provinceId);
    if (rows.length) return rows;
  } catch (err) {
    warnOnce('supabase cities', err);
  }
  // API
  try {
    const res = await withTimeout(
      fetch(`/api/locations/cities?province=${provinceId}`, { signal }).then((r) =>
        r.json(),
      ),
      2500,
      'cities api',
    );
    const rows = validateCities(res.cities, provinceId);
    if (rows.length) return rows;
  } catch (err) {
    warnOnce('api cities', err);
  }
  // Static
  const data = await withTimeout(
    loadStaticJSON<City[]>(`/geo/ph/cities.json`),
    2500,
    'cities static',
  );
  return validateCities(data, provinceId);
}

