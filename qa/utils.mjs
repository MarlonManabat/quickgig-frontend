export function watchConsoleAndNetwork(page) {
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push({ type: 'console', text: m.text() }); });
  page.on('pageerror', e => errors.push({ type: 'pageerror', text: String(e) }));
  page.on('response', r => { const s = r.status(); if (s >= 400) errors.push({ type: 'http', status: s, url: r.url() }); });
  return errors;
}
