const base = (process.env.BASE || '').replace(/\/$/, '');
if (!base) {
  console.warn('No BASE provided; skipping link check');
  process.exit(0);
}

const paths = ['/', '/find-work', '/post-job', '/login', '/signup'];

const fetchImpl = globalThis.fetch;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function head(u) {
  let last;
  for (let i = 0; i < 5; i++) {
    try {
      return await fetchImpl(u, { method: 'HEAD', redirect: 'manual' });
    } catch (e) {
      last = e;
      await wait(1000 * (i + 1));
    }
  }
  throw last || new Error('fetch failed');
}

(async () => {
  for (const p of paths) {
    const r = await head(base + p);
    if (r.status >= 200 && r.status < 400) {
      console.log(`\u2705 ${p} -> ${r.status}`);
    } else {
      throw new Error(`${p} -> ${r.status}`);
    }
  }
})();
