// scripts/smoke.mjs
/* Minimal smoke: hits /api/health and prints result.
   Usage:
     node scripts/smoke.mjs
     SMOKE_BASE=https://app.quickgig.ph node scripts/smoke.mjs
*/
const base = process.env.SMOKE_BASE || "http://localhost:3000";
const url = `${base.replace(/\/$/, "")}/api/health`;

(async () => {
  try {
    const r = await fetch(url);
    const body = await r.json().catch(() => ({}));
    const ok = r.ok && body?.ok === true;
    console.log(JSON.stringify({ base, status: r.status, body }, null, 2));
    process.exit(ok ? 0 : 1);
  } catch (e) {
    console.error("SMOKE ERROR:", e?.message || e);
    process.exit(1);
  }
})();
