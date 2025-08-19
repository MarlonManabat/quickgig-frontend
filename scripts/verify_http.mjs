#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/verify_http.mjs quickgig.ph
 *   node scripts/verify_http.mjs www.quickgig.ph
 *
 * Exits 0 if host 308-redirects to https://app.quickgig.ph/, else 1.
 */
import { execSync } from 'node:child_process';

const host = process.argv[2];
if (!host) {
  console.error('Host required'); process.exit(2);
}

try {
  const out = execSync(`curl -sSI https://${host}/ | tr -d '\r'`, { stdio: 'pipe' }).toString();
  const has308 = /HTTP\/\d\.\d 308/.test(out);
  const toApp = /Location:\s*https:\/\/app\.quickgig\.ph\//i.test(out);
  if (has308 && toApp) {
    console.log(`[ok] ${host} → app.quickgig.ph (308)`);
    process.exit(0);
  }
  console.error('[fail] Unexpected response:\n' + out);
  process.exit(1);
} catch (e) {
  console.error('[fail] Request error:\n' + (e.stdout?.toString() || e.message));
  process.exit(1);
}
