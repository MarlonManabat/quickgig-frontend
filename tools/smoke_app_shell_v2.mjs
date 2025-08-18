const base = process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';
if (process.env.NEXT_PUBLIC_ENABLE_APP_SHELL_V2 !== 'true') {
  console.log('[smoke] app shell v2 disabled');
  process.exit(0);
}
(async () => {
  const html = await fetch(base + '/').then((r) => r.text());
  const required = ['primary-cta', 'navbar', 'footer'];
const missing = required.filter((id) => !html.includes(`data-testid="${id}"`));
  if (missing.length) {
    console.error('[smoke] missing selectors', missing.join(', '));
    process.exit(1);
  }
  console.log('[smoke] shell v2 ok');
})();
