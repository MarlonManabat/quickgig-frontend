const base = process.env.SMOKE_URL || 'http://localhost:3000';
if (process.env.NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT !== 'true') {
  console.log('skipped');
  process.exit(0);
}
const fetchImpl = globalThis.fetch;
(async () => {
  try {
    const jobRes = await fetchImpl(base + '/api/employer/jobs', { method: 'POST' });
    const job = await jobRes.json();
    await fetchImpl(base + `/api/employer/jobs/${job.id}/close`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reason: 'filled', bulkNotify: false }),
    });
    await fetchImpl(base + `/api/employer/jobs/${job.id}/bulk/reject`, { method: 'POST' });
    await fetchImpl(base + `/api/employer/jobs/${job.id}/reopen`, { method: 'POST' });
    console.log('closeout smoke ok');
  } catch (err) {
    console.log('closeout smoke failed');
    process.exit(1);
  }
})();
