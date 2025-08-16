import { promises as fs } from 'fs';
import path from 'path';

const required = [
  'public/legacy/styles.css',
  'public/legacy/index.fragment.html',
  'public/legacy/login.fragment.html',
];

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  let ok = true;

  for (const rel of required) {
    const p = path.join(process.cwd(), rel);
    const exists = await fileExists(p);
    if (!exists) {
      console.error(`[legacy:verify] Missing: ${rel}`);
      ok = false;
    }
  }

  // Best-effort grep to block legacy engine endpoints (non-fatal if git/grep not present)
  try {
    const { execSync } = await import('node:child_process');
    const out = execSync(
      `grep -RIn --exclude-dir=node_modules -E 'login\\.php|quickgig\\.ph/login\\.php' . || true`,
      { stdio: ['ignore', 'pipe', 'ignore'] }
    ).toString();
    if (out.trim()) {
      console.error('[legacy:verify] Found legacy engine references:\n' + out);
      ok = false;
    }
  } catch {
    console.warn('[legacy:verify] grep not available; skipped reference scan.');
  }

  if (!ok) process.exit(1);
  console.log('[legacy:verify] OK');
}
main();
