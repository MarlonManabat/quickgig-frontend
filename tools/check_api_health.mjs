const URL = 'https://api.quickgig.ph/health.php';
(async ()=>{
  const r = await fetch(URL, { redirect: 'manual' });
  if (r.status !== 200) throw new Error(`API health ${r.status}`);
  const text = await r.text();
  if (!/ok/i.test(text)) throw new Error(`API payload missing ok: ${text.slice(0,120)}`);
  console.log('API OK');
})();
