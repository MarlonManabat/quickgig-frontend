import { Resolver } from 'dns/promises';

const resolver = new Resolver();

const records = [
  { name: 'quickgig.ph', type: 'A', expected: ['76.76.21.21'] },
  { name: 'www.quickgig.ph', type: 'CNAME', expected: ['cname.vercel-dns.com'] },
  { name: 'app.quickgig.ph', type: 'CNAME', expected: ['cname.vercel-dns.com'] },
  { name: 'api.quickgig.ph', type: 'A', expected: ['89.116.53.39'] }
];

const table = [];
let allOk = true;

function compare(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

for (const rec of records) {
  let actual = [];
  try {
    if (rec.type === 'A') {
      actual = await resolver.resolve4(rec.name);
    } else if (rec.type === 'CNAME') {
      actual = await resolver.resolveCname(rec.name);
    }
  } catch (err) {
    actual = [];
  }
  const ok = compare(actual, rec.expected);
  const actualStr = actual.join(', ') || '(none)';
  const expectedStr = rec.expected.join(', ');
  if (ok) {
    console.log(`\u2705 ${rec.name} ${rec.type} \u2192 ${actualStr}`);
  } else {
    console.log(`\u274C ${rec.name} ${rec.type} expected ${expectedStr} but got ${actualStr}`);
  }
  table.push({ record: `${rec.name} ${rec.type}`, expected: expectedStr, actual: actualStr });
  if (!ok) allOk = false;
}

if (!allOk) {
  console.log('\nExpected DNS records:');
  console.table(table);
  console.log('\nPlease configure Hostinger with the following records:');
  console.log('A     @     76.76.21.21');
  console.log('CNAME www   cname.vercel-dns.com');
  console.log('CNAME app   cname.vercel-dns.com');
  console.log('A     api   89.116.53.39');
  process.exit(1);
}
