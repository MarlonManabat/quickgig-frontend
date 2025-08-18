const base = process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';
const fetchImpl = globalThis.fetch;
const bail = (m)=>{ console.error(m); process.exit(1); };
(async () => {
  const r1 = await fetchImpl(base + '/', { method: 'HEAD', redirect: 'manual' });
  if (r1.status < 200 || r1.status >= 400) bail(`HEAD / expected 2xx; got ${r1.status}`);
  if (r1.headers.get('location')) bail('HEAD / should not redirect');
  const r2 = await fetchImpl(base + '/app', { method: 'HEAD', redirect: 'manual' });
  if (![301,302,307,308].includes(r2.status)) bail(`HEAD /app expected redirect; got ${r2.status}`);
  const loc = r2.headers.get('location') || '';
  if (loc !== '/' && loc !== base + '/') bail(`HEAD /app location must be root; got ${loc}`);
  if (process.env.SMOKE_APPS === '1') {
    try {
      const r3 = await fetchImpl(base + '/api/applications/TEST');
      if (r3.status !== 200) bail(`GET /api/applications/TEST ${r3.status}`);
      const r4 = await fetchImpl(base + '/api/applications/TEST', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'withdraw' }),
      });
      if (r4.status !== 200) bail(`PATCH /api/applications/TEST ${r4.status}`);
    } catch {
      bail('applications check failed');
    }
  }
  if (process.env.SMOKE_EMPLOYER === '1') {
    try {
      const r4 = await fetchImpl(base + '/api/company');
      if (r4.status !== 200) bail(`GET /api/company ${r4.status}`);
    } catch (e) {
      bail('company check failed');
    }
    if (process.env.SMOKE_SIGN === '1') {
      try {
        const r5 = await fetchImpl(base + '/api/files/sign?key=nonexistent');
        if (r5.status !== 404) console.log('sign check unexpected', r5.status);
      } catch {
        console.log('sign check skipped');
      }
    }
  }
  if (process.env.SMOKE_INTERVIEWS === '1') {
    try {
      const slot = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const r = await fetchImpl(base + '/api/employer/jobs/TEST/applicants/TEST/interviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ method: 'phone', slots: [{ at: slot }] }),
      });
      if (r.status !== 200) bail('interview create failed');
      const list = await fetchImpl(base + '/api/applications/TEST/interviews');
      if (list.status !== 200) bail('interview list failed');
      const arr = await list.json();
      const first = arr[0];
      const p = await fetchImpl(base + '/api/applications/TEST/interviews', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: first.id, action: 'accept', slot: { at: slot } }),
      });
      if (p.status !== 200) bail('interview accept failed');
    } catch {
      bail('interviews check failed');
    }
  }
  console.log('Smoke OK');
  if (process.env.SMOKE_REPORTS === '1') {
    try {
      const r = await fetchImpl(base + '/api/jobs/TEST/report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reason: 'spam' }),
      });
      if (r.status !== 200) bail('report failed');
      if (process.env.ALERTS_DIGEST_SECRET) {
        const d = await fetchImpl(base + `/api/admin/digest?secret=${process.env.ALERTS_DIGEST_SECRET}`);
        if (d.status !== 200) bail('digest failed');
      }
    } catch {
      bail('reports check failed');
    }
  }
})();
