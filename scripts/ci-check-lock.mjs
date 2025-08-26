import { execSync } from 'node:child_process';

try {
  execSync('git diff --exit-code -- package-lock.json', { stdio: 'inherit' });
  console.log('[ci-check-lock] lockfile ok');
} catch (err) {
  console.error('[ci-check-lock] package-lock.json changed');
  process.exit(1);
}

