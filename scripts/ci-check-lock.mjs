import { execSync } from 'node:child_process';

try {
  execSync('git diff --exit-code -- package-lock.json', { stdio: 'inherit' });
} catch {
  console.error('package-lock.json changed during install');
  process.exit(1);
}
