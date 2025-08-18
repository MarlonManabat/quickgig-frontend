/* minimal production smoke check */
const BASE = process.env.SMOKE_URL || process.env.BASE || '';
if (!BASE) {
  console.log('No SMOKE_URL set; skipping smoke');
  process.exit(0);
}
const paths = ['/', '/find-work'];
if (process.env.SMOKE_JOB_ID) paths.push(`/jobs/${process.env.SMOKE_JOB_ID}`);
paths.push('/health');
const max = Number(process.env.RATE_LIMIT_MAX_PER_WINDOW || 60);
const sliceCount =
  process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITING === 'true' ? Math.max(1, Math.floor(max / 2)) : paths.length;
for (const p of paths.slice(0, sliceCount)) {
  const url = BASE.replace(/\/+$/, '') + p;
  try {
    const r = await fetch(url);
    console.log(p, r.status);
  } catch (e) {
    console.log(p, String(e));
  }
}
