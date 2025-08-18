#!/usr/bin/env node
const base = process.env.SMOKE_URL || process.env.BASE || 'http://localhost:3000';

async function main() {
  if (process.env.ENGINE_MODE !== 'php') {
    console.log('ENGINE_MODE not php – skipped');
    return;
  }
  try {
    const health = await fetch(base + '/api/engine/health');
    const h = await health.json().catch(() => ({}));
    console.log('[engine] health', health.status, h.ok);
    if (!h.ok) throw new Error('health check failed');

    const jobs = await fetch(base + '/api/jobs');
    const list = await jobs.json().catch(() => []);
    console.log('[engine] jobs', jobs.status, Array.isArray(list) && list.length);
    if (!Array.isArray(list) || list.length === 0) throw new Error('jobs empty');

    const first = list[0]?.id;
    if (first) {
      const job = await fetch(base + `/api/jobs/${first}`);
      console.log('[engine] job detail', job.status);
      if (!job.ok) throw new Error('job detail failed');
    }

    const profile = await fetch(base + '/api/profile');
    console.log('[engine] profile', profile.status);
    if (profile.status !== 401) throw new Error('profile should be 401');
  } catch (err) {
    console.error('engine smoke failed', err);
    process.exit(1);
  }
}

main();

