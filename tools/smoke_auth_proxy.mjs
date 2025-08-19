if (process.env.VERCEL) { console.log('[smoke] skip auth proxy on Vercel'); process.exit(0); }
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
const fetchWithTimeout = (u) => Promise.race([
  fetch(u, { method:'OPTIONS' }),
  new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')), 3000))
]);
(async () => {
  await fetchWithTimeout(base + '/api/session/login');
  await fetchWithTimeout(base + '/api/session/register');
  console.log('[smoke] auth proxy routes reachable');
})();
