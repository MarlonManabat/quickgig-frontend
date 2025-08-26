const { BASE_URL, QA_TEST_SECRET } = process.env;
import { spawnSync } from 'node:child_process';

async function seedViaApi() {
  if (!BASE_URL) return false;
  try {
    const res = await fetch(`${BASE_URL}/api/test/seed`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${QA_TEST_SECRET ?? ''}`,
      },
    });
    if (res.ok) {
      console.log('[ci-seed-preview] seeded via api');
      return true;
    }
    console.warn('[ci-seed-preview] api seed failed:', res.status, await res.text());
  } catch (err) {
    console.warn('[ci-seed-preview] api seed error:', err.message);
  }
  return false;
}

function seedFallback() {
  const r = spawnSync('npx', ['tsx', 'scripts/seed-preview.mts'], {
    stdio: 'inherit',
  });
  if (r.status === 0) {
    console.log('[ci-seed-preview] seeded via script');
    return true;
  }
  console.warn('[ci-seed-preview] fallback seed failed');
  return false;
}

const run = async () => {
  if (await seedViaApi()) return;
  seedFallback();
};

run();
