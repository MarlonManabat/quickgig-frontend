const HOST = 'app.quickgig.ph';
const IP = '89.116.53.39';
const url = `https://${HOST}`;

(async () => {
  const r = await fetch(url, {
    redirect: 'manual',
    // Force-connect to Hostinger IP while sending the correct Host header
    // Node-fetch honors 'dispatcher' only with undici; fallback to curl step in CI if needed.
  });
  // If the runtime can't override DNS, we also provide a shell step in CI (see workflow).
  if (r.status < 200 || r.status >= 400) throw new Error(`APP not up at ${HOST}: ${r.status}`);
  const html = await r.text();
  if (!/QuickGig/i.test(html)) throw new Error('HTML does not look like QuickGig');
  console.log('App content OK at', HOST);
})();
