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
  try {
    const rC = await fetch(`${BASE}/api/messages?count=1`);
    console.log('messages count', rC.status);
  } catch (e) { console.log('messages count error', String(e)); }
  try {
    const rL = await fetch(`${BASE}/api/messages?latest=1`);
    console.log('messages latest', rL.status);
  } catch (e) { console.log('messages latest error', String(e)); }
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
    const rA = await fetch(`${BASE}/api/alerts`);
    const j = await rA.json().catch(() => []);
    console.log('alerts count', Array.isArray(j) ? j.length : 0);
  } catch (e) { console.log('alerts count error', String(e)); }
  try {
    const c = await fetch(`${BASE}/api/alerts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'demo', freq: 'daily', size: 12 }),
    });
    console.log('alerts create', c.status);
    const a = await c.json().catch(() => ({}));
    const id = a.id;
    if (id) {
      const d = await fetch(`${BASE}/api/alerts/${id}`, { method: 'DELETE' });
      console.log('alerts delete', d.status);
    }
  } catch (e) { console.log('alerts api error', String(e)); }

  try {
    const rA = await fetch(`${BASE}/account`);
    console.log('account page', rA.status);
  } catch (e) { console.log('account page error', String(e)); }
  try {
    const prof = await fetch(`${BASE}/api/account/profile`);
    const p = await prof.json().catch(()=>null);
    const calc = (pp)=>{ if(!pp) return 0; let s=0; if(pp.name && pp.bio) s+=30; if(pp.email && pp.phone) s+=20; if(pp.roles && pp.roles.length) s+=20; if(pp.resumeUrl) s+=15; return Math.min(100,s); };
    console.log('completeness', calc(p));
  } catch (e) { console.log('completeness error', String(e)); }
  try {
    const rE = await fetch(`${BASE}/employer/jobs`);
    const txt = await rE.text();
    console.log('employer jobs page', rE.status);
    if (process.env.ENGINE_MODE === 'mock') {
      if (/Applicants?/i.test(txt)) console.log('mock applicants ok');
      else console.log('mock applicants missing');
    }
  } catch (e) { console.log('employer jobs page error', String(e)); }

  try {
    const rM = await fetch(`${BASE}/api/messages`);
    console.log('messages api', rM.status);
    if (process.env.ENGINE_AUTH_MODE === 'mock' && rM.ok) {
      const rC = await fetch(`${BASE}/api/messages`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ toId: 'other', jobId: 'demo', title: 'Demo' }),
      });
      console.log('messages create', rC.status);
      const j = await rC.json().catch(() => ({}));
      const tid = j.thread?.id;
      if (tid) {
        const rS = await fetch(`${BASE}/api/messages/${tid}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ body: 'hello' }),
        });
        console.log('messages send', rS.status);
      }
    }
  } catch (e) { console.log('messages api error', String(e)); }

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

    // applicant profile API
    try {
      const profGet = await fetch(`${BASE}/api/account/profile`);
      const txt = await profGet.text();
      console.log('profile get', profGet.status, /email/i.test(txt));
    } catch (e) {
      console.log('profile get error', String(e));
    }
    try {
      const profPut = await fetch(`${BASE}/api/account/profile`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phone: '0999-000-0000' })
      });
      console.log('profile put', profPut.status);
    } catch (e) {
      console.log('profile put error', String(e));
    }
  }
})();
