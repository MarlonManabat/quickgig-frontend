const base = process.env.SMOKE_BASE_URL || process.env.BASE || 'http://localhost:3000';
if (process.env.NEXT_PUBLIC_ENABLE_HIRING !== 'true') {
  console.log('skipped');
  process.exit(0);
}
const fetchImpl = globalThis.fetch;
(async () => {
  const offer = { startDate: '2025-01-01', rate: '1000', notes: 'test' };
  let r = await fetchImpl(base + '/api/applications/1/offer', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(offer),
  });
  if (r.status !== 200) throw new Error('offer failed');
  r = await fetchImpl(base + '/api/applications/1/accept', { method: 'POST' });
  if (r.status !== 200) throw new Error('accept failed');
  let list = await fetchImpl(base + '/api/applications');
  const arr = await list.json();
  const one = arr.find((a) => a.id === '1');
  if (one?.status !== 'offer_accepted') throw new Error('status not offer_accepted');
  let detail = await fetchImpl(base + '/api/applications/1');
  const det = await detail.json();
  if (det.status !== 'offer_accepted') throw new Error('detail status');
  await fetchImpl(base + '/api/applications/2/offer', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  await fetchImpl(base + '/api/applications/2/decline', { method: 'POST' });
  list = await fetchImpl(base + '/api/applications');
  const arr2 = await list.json();
  const two = arr2.find((a) => a.id === '2');
  if (two?.status !== 'offer_declined') throw new Error('status not offer_declined');
  console.log('hiring smoke ok');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
