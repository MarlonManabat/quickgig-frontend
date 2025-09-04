// scripts/check-lock-sync.mjs
import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json','utf8'));
// npm v7+ lockfileVersion is 2 or 3; verify name+version match and that all direct deps exist in lock
const problems = [];
if (lock.name !== pkg.name) problems.push(`lockfile name mismatch: ${lock.name} != ${pkg.name}`);
if (lock.version !== pkg.version) problems.push(`lockfile version mismatch: ${lock.version} != ${pkg.version}`);
const direct = { ...(pkg.dependencies||{}), ...(pkg.devDependencies||{}) };
for (const dep of Object.keys(direct)) {
  // lockfile v3 keeps a top-level packages["node_modules/<dep>"]
  const hasV3 = lock.packages && lock.packages[`node_modules/${dep}`];
  // v2 keeps lock.dependencies[dep]
  const hasV2 = lock.dependencies && lock.dependencies[dep];
  if (!hasV3 && !hasV2) problems.push(`missing in lock: ${dep}`);
}
if (problems.length) {
  console.error(`Lockfile out of sync:\n- ` + problems.join('\n- '));
  process.exit(1);
}
