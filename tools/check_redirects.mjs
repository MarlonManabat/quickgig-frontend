const fetchImpl = globalThis.fetch;
async function head(u){ return fetchImpl(u,{method:'HEAD',redirect:'manual'}); }

(async () => {
  const ROOT = 'https://quickgig.ph';
  const WWW  = 'https://www.quickgig.ph';
  const APP  = 'https://app.quickgig.ph';

  // root → app
  let r = await head(ROOT + '/');
  if (![301,302,307,308].includes(r.status)) throw new Error(`ROOT not redirecting: ${r.status}`);
  let loc = r.headers.get('location')||'';
  if (!loc.startsWith(APP)) throw new Error(`ROOT Location wrong: ${loc}`);
  console.log('Root redirect OK →', loc);

  // www → app
  r = await head(WWW + '/');
  if (![301,302,307,308].includes(r.status)) throw new Error(`WWW not redirecting: ${r.status}`);
  loc = r.headers.get('location')||'';
  if (!loc.startsWith(APP)) throw new Error(`WWW Location wrong: ${loc}`);
  console.log('WWW redirect OK →', loc);
})();
