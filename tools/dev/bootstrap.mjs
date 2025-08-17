import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const requiredMarkers = ['.git', 'package.json', 'public'];

for (const marker of requiredMarkers) {
  if (!fs.existsSync(path.join(root, marker))) {
    console.error('bootstrap: run from repository root');
    process.exit(1);
  }
}

function banner(msg) {
  console.log(`\n=== ${msg} ===`);
}

function step(cmd, msg) {
  banner(msg);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  step('git fetch origin', 'Fetching origin');

  banner('Ensuring pull.rebase true');
  try {
    const current = execSync('git config --global --get pull.rebase', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (!current) {
      execSync('git config --global pull.rebase true', { stdio: 'inherit' });
    } else {
      console.log(`pull.rebase already ${current}`);
    }
  } catch {
    execSync('git config --global pull.rebase true', { stdio: 'inherit' });
  }

  step('git pull --rebase origin main', 'Rebasing onto origin/main');
  step('npm ci', 'Installing dependencies');
  step('npm run legacy:verify', 'Verifying legacy assets');

  banner('Bootstrap complete ✅');
} catch (err) {
  const out = `${err.stderr || ''}${err.stdout || ''}${err.message || ''}`;
  if (/resolve host|network|ENOTFOUND/i.test(out)) {
    console.error('Network issue; retry later');
  } else if (/CONFLICT|could not apply|rebase/i.test(out)) {
    console.error('Resolve conflicts then re-run: npm run bootstrap');
  }
  process.exit(1);
}
