#!/usr/bin/env node
import { globby } from 'globby';
import path from 'node:path';
import fs from 'node:fs';

const apis = await globby(['pages/api/**/*.ts','src/app/api/**/route.ts']);
const normalized = apis.map(p => {
  if (p.startsWith('pages/api/')) return 'api:' + p.replace(/^pages\/api\/|\.ts$/g,'');
  return 'api:' + p.replace(/^src\/app\/api\/|\/route\.ts$/g,'');
});
const seen = new Set();
for (const k of normalized) {
  if (seen.has(k)) {
    console.error('❌ API route conflict between Pages and App Router for:', k);
    process.exit(1);
  }
  seen.add(k);
}
console.log('✅ No API route conflicts');
