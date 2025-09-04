const base = process.env.BASE_URL || 'https://app.quickgig.ph';
const paths = ['/login', '/browse-jobs', '/gigs/create', '/applications'];

for (const p of paths) {
  const res = await fetch(base + p, { method: 'HEAD', redirect: 'manual' }).catch(() => null);
  if (!res || (res.status >= 400)) {
    throw new Error(`Health check failed for ${p}: ${res ? res.status : 'no response'}`);
  }
}
console.log('CTA links healthy');
