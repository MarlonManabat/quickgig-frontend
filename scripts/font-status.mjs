import { execSync as sh } from 'child_process';
const BASE = process.env.SMOKE_BASE || 'https://quickgig.ph';
const url = `${BASE}/api/legacy-selftest`; // backing endpoint for /legacy-diag
try {
  const raw = sh(`curl -fsSL "${url}"`).toString();
  const j = JSON.parse(raw);
  const k = 'public/legacy/fonts/LegacySans.woff2';
  const f = j.files?.[k] || {};
  console.log("Prod font:", k);
  console.log(" exists:", f.exists, " http:", f.httpStatus, " size:", f.size, " sha256:", f.sha256);
} catch (e) {
  console.error("Could not fetch", url, e?.message || e);
  process.exit(1);
}
