#!/usr/bin/env node
import fg from 'fast-glob';
import fs from 'fs';

const files = await fg(['{app,src,components,pages}/**/*.{ts,tsx,jsx}'], { ignore: ['**/node_modules/**'] });
let violations = 0;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (s.match(/href=["'`]\/[^"'`]*\[[^"'`]+?\][^"'`]*["'`]/)) {
    console.log(`href missing params in ${f}`);
    violations++;
  }
  if (s.match(/router\.push\(["'`]\/[^"'`]*\[[^"'`]+?\][^"'`]*["'`]\)/)) {
    console.log(`router.push missing params in ${f}`);
    violations++;
  }
  if (s.match(/<button(?=[^>]*type=["']?submit)/) && s.match(/onClick=.*router\.push/)) {
    console.log(`button submit + router.push risk in ${f} (use type="button")`);
    violations++;
  }
}
if (violations) { console.error(`Found ${violations} potential nav issues`); process.exit(1); }
console.log('No nav issues found');
