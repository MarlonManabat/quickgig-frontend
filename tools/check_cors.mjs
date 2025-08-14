const base = (process.env.BASE || '').replace(/\/$/, '');
if (!base) {
  console.warn('No BASE provided; skipping CORS check');
  process.exit(0);
}

(async () => {
  try {
    const res = await fetch(base + '/', { method: 'HEAD' });
    const acao = res.headers.get('access-control-allow-origin');
    if (!acao) throw new Error('Missing Access-Control-Allow-Origin header');
    console.log('CORS OK');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
