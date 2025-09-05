import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASELINE_PATH = path.resolve(ROOT, 'ci/tsc-baseline.json');
const ARTIFACT_OUT = path.resolve(ROOT, 'ci/tsc-output.txt');

function runTsc() {
  // --pretty false gives grep-able output, --noEmit avoids build artifacts
  const cmd = 'npx tsc -p tsconfig.json --noEmit --pretty false';
  try {
    const out = execSync(cmd, { encoding: 'utf8' });
    return { out, code: 0 };
  } catch (err) {
    const out = (err.stdout?.toString?.() || '') + (err.stderr?.toString?.() || '');
    const code = typeof err.status === 'number' ? err.status : 1;
    return { out, code };
  }
}

function countErrors(tscOutput) {
  // Count occurrences of "error TS1234" patterns
  const matches = tscOutput.match(/error TS\d{4}:/g) || [];
  return matches.length;
}

function readBaseline() {
  try {
    const txt = fs.readFileSync(BASELINE_PATH, 'utf8');
    const json = JSON.parse(txt);
    const n = Number(json.maxErrors);
    return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
  } catch {
    return Number.MAX_SAFE_INTEGER; // missing or malformed: be permissive
  }
}

function writeArtifact(tscOutput) {
  try {
    fs.mkdirSync(path.dirname(ARTIFACT_OUT), { recursive: true });
    fs.writeFileSync(ARTIFACT_OUT, tscOutput, 'utf8');
  } catch {}
}

const { out, code } = runTsc();
const errors = countErrors(out);
writeArtifact(out);

const baseline = readBaseline();
const strict = process.env.TSC_STRICT_GUARD === '1';

const summary = `TypeScript errors: ${errors} (baseline: ${baseline})${strict ? ' [STRICT]' : ''}`;
if (errors > baseline) {
  console.log(`::warning::${summary} — regression detected.`); // visible in Actions UI
  // In strict mode, fail; otherwise pass as informational.
  process.exit(strict ? 1 : 0);
} else {
  console.log(`::notice::${summary} — no regression.`);
  process.exit(0);
}
