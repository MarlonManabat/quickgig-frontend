import { execSync } from 'node:child_process';

try {
  execSync('git diff --exit-code -- package-lock.json', { stdio: 'inherit' });
  console.log('[check-lock-consistency] lockfile ok');
} catch (err) {
  console.error('[check-lock-consistency] package-lock.json changed');
  process.exit(1);
}

