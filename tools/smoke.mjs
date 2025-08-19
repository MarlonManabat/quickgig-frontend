const VERCEL_ENV = process.env.VERCEL_ENV;
if (VERCEL_ENV !== 'production') {
  console.log('skip: non-prod env');
  process.exit(0);
}
if (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.trim() === '') {
  console.log('skip: no API URL');
  process.exit(0);
}
const base =
  process.env.SMOKE_BASE_URL || process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';
const TIMEOUT = 5000;
const fetchImpl = async (url, init) => {
  try {
    return await globalThis.fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT) });
  } catch (err) {
    const msg = err.name === 'AbortError' ? `timeout after ${TIMEOUT}ms` : err.message || err;
    console.error(`[smoke] fetch failed for ${url}: ${msg}`);
    if (VERCEL_ENV === 'production') process.exit(1);
    throw err;
  }
};
const bail = (m)=>{ console.error(m); process.exit(1); };
const beta = process.env.NEXT_PUBLIC_ENABLE_BETA_RELEASE === 'true';
const isProd = process.env.NODE_ENV === 'production';
if (beta || isProd) {
  process.env.NEXT_PUBLIC_ENABLE_EMAILS = 'true';
  process.env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER = 'true';
  process.env.NEXT_PUBLIC_ENABLE_INTERVIEWS = 'true';
  process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES = 'true';
  process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS = 'true';
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS = 'true';
  process.env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT = 'true';
}
(async () => {
  const r1 = await fetchImpl(base + '/', { method: 'HEAD', redirect: 'manual' });
  if (r1.status < 200 || r1.status >= 400) bail(`HEAD / expected 2xx; got ${r1.status}`);
  if (r1.headers.get('location')) bail('HEAD / should not redirect');
  const r2 = await fetchImpl(base + '/app', { method: 'HEAD', redirect: 'manual' });
  if (![301,302,307,308].includes(r2.status)) bail(`HEAD /app expected redirect; got ${r2.status}`);
  const loc = r2.headers.get('location') || '';
  if (loc !== '/' && loc !== base + '/') bail(`HEAD /app location must be root; got ${loc}`);
  const home = await fetchImpl(base + '/');
  const homeTxt = await home.text();
  if (process.env.NEXT_PUBLIC_ENABLE_MONITORING === 'true') {
    if (/data-testid="monitoring-flag"/.test(homeTxt)) console.log('[smoke] monitoring on');
    else console.log('[smoke] monitoring missing');
  } else {
    if (/data-testid="monitoring-flag"/.test(homeTxt)) console.log('[smoke] monitoring off unexpected');
    else console.log('[smoke] monitoring off ok');
  }
  if (process.env.NEXT_PUBLIC_ENABLE_LINK_MAP_SANITY === 'true') {
    try {
      const mod = await import('./linkMapSanity.mjs');
      await mod.linkMapSanity();
    } catch {
      console.log('[smoke] link map sanity failed');
    }
  } else {
    console.log('[smoke] link map sanity skipped');
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_STATUS_PAGE === 'true') {
    try {
      const s = await fetchImpl(base + '/status');
      const txt = await s.text();
      if (
        s.status === 200 &&
        /data-testid="status-engine">ok/.test(txt) &&
        /data-testid="status-db">ok/.test(txt)
      ) console.log('[smoke] status ok');
      else console.log('[smoke] status', s.status);
    } catch {
      console.log('[smoke] status check failed');
    }
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_SECURITY_AUDIT === 'true') {
    try {
      const r = await fetchImpl(base + '/status/ping');
      const j = await r.json().catch(() => ({}));
      if (r.status === 200 && j.pong) console.log('[smoke] ping ok');
      else console.log('[smoke] ping', r.status);
    } catch {
      console.log('[smoke] ping check failed');
    }
  } else {
    console.log('[smoke] ping skipped');
  }
  const runEngine = process.argv.includes('--engine');
  if (runEngine) {
    try {
      const s = await fetchImpl(base + '/api/session');
      console.log('[engine] session', s.status);
      const jobs = await fetchImpl(base + '/api/jobs?limit=1');
      console.log('[engine] jobs', jobs.status);
      let firstId;
      try { const arr = await jobs.json(); firstId = Array.isArray(arr) && arr[0]?.id; } catch {}
      if (firstId) {
        const d = await fetchImpl(base + `/api/jobs/${firstId}`);
        console.log('[engine] job detail', d.status);
      }
      const profile = await fetchImpl(base + '/api/profile');
      console.log('[engine] profile', profile.status);
      const apps = await fetchImpl(base + '/api/applications');
      console.log('[engine] applications', apps.status);
    } catch {
      console.log('[engine] checks failed');
    }
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_SETTINGS === 'true') {
    try {
      const s = await fetchImpl(base + '/settings');
      const txt = await s.text();
      if (s.status === 200 && /Language/i.test(txt)) console.log('[smoke] settings ok');
      else console.log('[smoke] settings', s.status);
    } catch {
      console.log('[smoke] settings check failed');
    }
    try {
      const api = await fetchImpl(base + '/api/settings');
      const j = await api.json().catch(() => ({}));
      if (api.status === 200 && j.lang) console.log('[smoke] api settings ok');
      else console.log('[smoke] api settings', api.status);
      await fetchImpl(base + '/api/settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...j, email: 'none' }),
      });
      const after = await fetchImpl(base + '/api/settings');
      const j2 = await after.json().catch(() => ({}));
      if (j2.email && j2.email === 'none') console.log('[smoke] api settings patch ok');
      else console.log('[smoke] api settings patch', after.status);
    } catch {
      console.log('[smoke] api settings failed');
    }
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER === 'true') {
    try {
      const n = await fetchImpl(base + '/notifications');
      const txt = await n.text();
      if (n.status === 200 && /Notifications/i.test(txt)) console.log('[smoke] notifications ok');
      else console.log('[smoke] notifications', n.status);
    } catch {
      console.log('[smoke] notifications check failed');
    }
    try {
      await fetchImpl(base + '/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      const after = await fetchImpl(base + '/api/notifications?size=0');
      const j = await after.json().catch(() => ({}));
      if (after.status === 200 && j.unread === 0) console.log('[smoke] mark-all-read ok');
      else console.log('[smoke] mark-all-read', after.status);
    } catch {
      console.log('[smoke] mark-all-read failed');
    }
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER === 'true') {
    try {
      const r = await fetchImpl(base + '/api/notify/index');
      const j = await r.json().catch(() => ({}));
      if (r.status === 200 && typeof j.counts?.total === 'number') console.log('[smoke] notify index ok');
      else console.log('[smoke] notify index', r.status);
      const before = j.counts?.total || 0;
      await fetchImpl(base + '/api/notify/mock', { method: 'POST' });
      const r2 = await fetchImpl(base + '/api/notify/index');
      const j2 = await r2.json().catch(() => ({}));
      if (r2.status === 200 && j2.counts?.total === before + 1) console.log('[smoke] notify increment ok');
      else console.log('[smoke] notify increment', r2.status);
    } catch {
      console.log('[smoke] notify failed');
    }
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true') {
    if (process.env.NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE === 'true') {
      try {
        const r = await fetchImpl(base + '/api/payments/live', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ amount: 1, method: 'stripe' }),
        });
        const j = await r.json().catch(() => ({}));
        if (r.status === 200 && j.ok) console.log('[smoke] payments live ok');
        else console.log('[smoke] payments live', r.status);
      } catch {
        console.log('[smoke] payments live check failed');
      }
    } else {
      try {
        const r = await fetchImpl(base + '/api/payments/mock', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ amount: 1, method: 'gcash' }),
        });
        const j = await r.json().catch(() => ({}));
        if (r.status === 200 && j.ok) console.log('[smoke] payments ok');
        else console.log('[smoke] payments', r.status);
      } catch {
        console.log('[smoke] payments check failed');
      }
    }
  } else {
    console.log('[smoke] payments skipped');
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_INTERVIEWS === 'true') {
      for (const p of ['/interviews', '/employer/interviews']) {
        try {
          const r = await fetchImpl(base + p, { redirect: 'manual' });
          console.log('[smoke] interviews', p, r.status);
        } catch {
          console.log('[smoke] interviews failed', p);
        }
      }
      try {
        const r = await fetchImpl(base + '/api/interviews?appId=demo');
        console.log('[smoke] api interviews GET', r.status);
      } catch {
        console.log('[smoke] api interviews GET failed');
      }
      try {
        const r = await fetchImpl(base + '/api/interviews', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ appId: 'demo', jobId: 'demo', employerId: 'e', applicantId: 'a', method: 'video', whenISO: new Date().toISOString(), durationMins: 30 }),
        });
        const j = await r.json().catch(() => ({}));
        console.log('[smoke] api interviews POST', r.status, j.ok);
      } catch {
        console.log('[smoke] api interviews POST failed');
      }
    }
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
  if (process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES === 'true') {
    try {
      const start = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      const create = await fetchImpl(base + '/api/interviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          appId: 'demo',
          jobId: 'demo',
          employerId: 'e',
          applicantId: 'a',
          whenISO: start,
          durationMins: 30,
          method: 'video',
        }),
      });
      const j = await create.json().catch(() => ({}));
      const id = j.id || j.interview?.id;
      if (id) {
        const r = await fetchImpl(base + `/api/interviews/${id}/invite`, {
          method: 'POST',
        });
        console.log('[smoke] invite', r.status);
        const r2 = await fetchImpl(base + '/api/interviews/remind-due', {
          method: 'POST',
        });
        console.log('[smoke] remind', r2.status);
      }
    } catch {
      console.log('[smoke] interview invites failed');
    }
  }
  if (process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS_QA === 'true') {
    try {
      const r = await fetchImpl(base + '/qa/interview-reminders?auto=1');
      const txt = await r.text();
      if (
        r.status === 200 &&
        /data-testid="invite-sent"/.test(txt) &&
        /data-testid="reminder-sent"/.test(txt)
      ) {
        console.log('[smoke] interview reminders qa ok');
      } else {
        console.log('[smoke] interview reminders qa', r.status);
      }
    } catch {
      console.log('[smoke] interview reminders qa failed');
    }
  } else {
    console.log('[smoke] interview reminders qa skipped');
  }
  if (process.env.NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA === 'true') {
    try {
      const r = await fetchImpl(base + '/qa/bulk-rejection?auto=1');
      const txt = await r.text();
      if (r.status === 200 && /data-testid="bulk-email-preview"/.test(txt)) {
        console.log('[smoke] bulk rejection qa ok');
      } else {
        console.log('[smoke] bulk rejection qa', r.status);
      }
    } catch {
      console.log('[smoke] bulk rejection qa failed');
    }
  } else {
    console.log('[smoke] bulk rejection qa skipped');
  }
  if (process.env.NEXT_PUBLIC_ENABLE_HIRING_QA === 'true') {
    try {
      const r = await fetchImpl(base + '/qa/hiring-decisions?auto=1');
      const txt = await r.text();
      if (
        r.status === 200 &&
        /data-testid="status-hired"/.test(txt) &&
        /data-testid="status-not_selected"/.test(txt) &&
        /data-testid="closeout-preview"/.test(txt)
      ) {
        console.log('[smoke] hiring decisions qa ok');
      } else {
        console.log('[smoke] hiring decisions qa', r.status);
      }
    } catch {
      console.log('[smoke] hiring decisions qa failed');
    }
  } else {
    console.log('[smoke] hiring decisions qa skipped');
  }
  if (process.env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER_QA === 'true') {
    try {
      const r = await fetchImpl(base + '/qa/notifications-center?auto=1');
      const txt = await r.text();
      if (
        r.status === 200 &&
        /data-testid="toast-msg"/.test(txt) &&
        /data-testid="notify-list"/.test(txt)
      ) {
        console.log('[smoke] notify center qa ok');
      } else {
        console.log('[smoke] notify center qa', r.status);
      }
    } catch {
      console.log('[smoke] notify center qa failed');
    }
  } else {
    console.log('[smoke] notify center qa skipped');
  }
  if (process.env.SMOKE_URL && process.env.NEXT_PUBLIC_ENABLE_I18N_POLISH === 'true') {
    try {
      const en = await fetchImpl(base + '/?lang=english');
      const enTxt = await en.text();
      const tl = await fetchImpl(base + '/?lang=taglish');
      const tlTxt = await tl.text();
      if (
        en.status === 200 &&
        tl.status === 200 &&
        /data-testid="home-tagline">Fast-track your next gig\./.test(enTxt) &&
        /data-testid="home-tagline">Bilis ang next gig mo\./.test(tlTxt)
      ) {
        console.log('[smoke] i18n polish ok');
      } else {
        console.log('[smoke] i18n polish mismatch');
      }
    } catch {
      console.log('[smoke] i18n polish failed');
    }
  } else {
    console.log('[smoke] i18n polish skipped');
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
