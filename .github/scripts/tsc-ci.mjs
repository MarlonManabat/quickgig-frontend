import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const BASELINE_FILE = 'docs/tsc-baseline.json';
const out = execSync('npx tsc -p tsconfig.json --noEmit', { encoding: 'utf8' });
const errCount = (out.match(/error TS\d+/g) || []).length;

if (!existsSync(BASELINE_FILE)) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ errors: errCount }, null, 2));
  console.log(`Baseline created with ${errCount} errors`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8')).errors ?? 0;
console.log(`TSC errors: ${errCount} (baseline: ${baseline})`);
if (errCount > baseline) {
  console.error(`Type errors increased by ${errCount - baseline}. Failing.`);
  process.exit(1);
} else {
  console.log('No regression in type errors.');
  process.exit(0);
}
