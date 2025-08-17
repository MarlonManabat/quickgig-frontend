/* Minimal smoke: fetch a few known pages after deploy if SMOKE_URL is set */
import { setTimeout as sleep } from 'timers/promises';
const BASE = process.env.SMOKE_URL || process.env.BASE || '';
if (!BASE) { console.log('No SMOKE_URL set; skipping smoke'); process.exit(0); }
const PATHS = ['/', '/find-work', '/login', '/account', '/employer/jobs',
  ...(process.env.SMOKE_JOB_ID ? [`/jobs/${process.env.SMOKE_JOB_ID}`, `/jobs/${process.env.SMOKE_JOB_ID}/apply`] : [])
];
const fetchJson = async (url) => {
  const r = await fetch(url, { headers:{ 'accept':'text/html' }});
  if (!r.ok) throw new Error(`${r.status} ${url}`);
};
(async () => {
  for (const p of PATHS) {
    const url = BASE.replace(/\/+$/,'') + p;
    try { await fetchJson(url); console.log('OK', url); }
    catch (e) { console.log('WARN', String(e)); }
    await sleep(250);
  }
  // Hit a filter query (non-blocking)
  try {
    const rQ = await fetch(`${BASE}/find-work?q=demo`);
    console.log('find-work?q demo', rQ.status);
  } catch (e) { console.log('find-work?q error', String(e)); }
  try {
    const rS = await fetch(`${BASE}/saved`);
    console.log('saved page', rS.status);
  } catch (e) { console.log('saved page error', String(e)); }

  try {
    const rA = await fetch(`${BASE}/account`);
    console.log('account page', rA.status);
  } catch (e) { console.log('account page error', String(e)); }
  try {
    const rE = await fetch(`${BASE}/employer/jobs`);
    const txt = await rE.text();
    console.log('employer jobs page', rE.status);
    if (process.env.ENGINE_MODE === 'mock') {
      if (/Applicants?/i.test(txt)) console.log('mock applicants ok');
      else console.log('mock applicants missing');
    }
  } catch (e) { console.log('employer jobs page error', String(e)); }

  if (process.env.SMOKE_POST_JOB === '1') {
    try {
      const rP = await fetch(`${BASE}/employer/post`);
      console.log('post-job page', rP.status);
    } catch (e) { console.log('post-job page error', String(e)); }
  }
  // Soft-check a guaranteed-404 path; do not fail build
  try {
    const url404 = BASE.replace(/\/+$/,'') + '/definitely-not-here-404';
    const r404 = await fetch(url404);
    console.log('404-check', r404.status);
  } catch (e) {
    console.log('404-check error', String(e));
  }

  // Optional locale smoke checks
  const check = async (path, re, label) => {
    try {
      const r = await fetch(BASE.replace(/\/+$/,'') + path);
      const txt = await r.text();
      if (re.test(txt)) console.log('\u2705', label);
      else console.log('\u26a0\ufe0f', label, 'missing');
    } catch (e) {
      console.log('\u26a0\ufe0f', label, String(e));
    }
  };
  await check('/?lang=tl', /Hanap|Trabaho|Mag-apply/i, 'home tl');
  await check('/find-work?lang=tl&q=zzzzzz', /Wala pang resulta/i, 'find-work tl empty');
  await check('/saved?lang=en', /Saved jobs/i, 'saved en');
  if (process.env.ENGINE_AUTH_MODE === 'mock') {
    try {
      const loginRes = await fetch(`${BASE}/api/session/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'boss@biz.com', password: 'x' }),
        redirect: 'manual'
      });
      console.log('login', loginRes.status);
      const cookie = loginRes.headers.get('set-cookie') || '';
      if (loginRes.ok) {
        const jobsRes = await fetch(`${BASE}/employer/jobs`, { headers: { cookie } });
        const txt = await jobsRes.text();
        console.log('authed employer jobs', jobsRes.status);
        if (/Applicants?/i.test(txt)) console.log('mock applicants ok');
        const apiJobs = await fetch(`${BASE}/api/employer/jobs`, { headers: { cookie } });
        const jobs = await apiJobs.json().catch(() => []);
        const jobId = jobs[0]?.id;
        if (jobId) {
          const appPage = await fetch(`${BASE}/employer/jobs/${jobId}/applicants`, { headers: { cookie } });
          const appTxt = await appPage.text();
          console.log('applicants page', appPage.status);
          if (/Status/i.test(appTxt)) console.log('applicants page ok');
          try {
            const csvRes = await fetch(`${BASE}/api/employer/jobs/${jobId}/applicants.csv`, { headers: { cookie } });
            console.log('applicants.csv', csvRes.status, csvRes.headers.get('content-type'));
          } catch (e) {
            console.log('applicants.csv error', String(e));
          }
          try {
            const emailsRes = await fetch(`${BASE}/api/employer/jobs/${jobId}/emails.txt`, { headers: { cookie } });
            const emailsTxt = await emailsRes.text().catch(() => '');
            console.log('emails.txt', emailsRes.status, emailsTxt.includes('@'));
          } catch (e) {
            console.log('emails.txt error', String(e));
          }
          const aid = jobs[0]?.applicants?.[0]?.id;
          if (aid) {
            const putRes = await fetch(`${BASE}/api/employer/jobs/${jobId}/applicants/${aid}`, {
              method: 'PUT',
              headers: { 'content-type': 'application/json', cookie },
              body: JSON.stringify({ status: 'shortlist' }),
            });
            console.log('update applicant', putRes.status);
            const upd = await putRes.json().catch(() => ({}));
            if (upd?.status) console.log('status', upd.status);
            try {
              const bulkRes = await fetch(`${BASE}/api/employer/jobs/${jobId}/applicants/bulk`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json', cookie },
                body: JSON.stringify({ ids: [aid], status: 'shortlist' }),
              });
              console.log('bulk update', bulkRes.status);
            } catch (e) {
              console.log('bulk update error', String(e));
            }
          }
        }
        const logoutRes = await fetch(`${BASE}/api/session/logout`, { method: 'POST', headers: { cookie } });
        console.log('logout', logoutRes.status);
      }
    } catch (e) {
      console.log('auth flow error', String(e));
    }
  }
})();
