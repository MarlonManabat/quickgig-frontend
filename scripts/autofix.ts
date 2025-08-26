import { execSync } from 'child_process';
import fs from 'fs';

try {
  execSync('npx eslint . --fix', { stdio: 'inherit' });
} catch {
  // ignore lint errors
}

const diff = execSync('git diff', { encoding: 'utf8' });
fs.writeFileSync('autofix.patch', diff);
