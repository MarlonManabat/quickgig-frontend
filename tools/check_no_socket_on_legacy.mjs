import fs from 'node:fs';
import path from 'node:path';

const candidates = [
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'app/page.tsx',
  'app/login/page.tsx',
  'pages/index.tsx',
  'pages/index.jsx',
  'pages/login.tsx',
  'pages/login.jsx',
];

const existing = candidates.filter(p => fs.existsSync(path.join(process.cwd(), p)));
const patterns = [
  /from\s+['"]socket\.io-client['"]/,
  /require\(['"]socket\.io-client['"]\)/,
  /\bio\s*\(/,
  /\bnew\s+WebSocket\s*\(/,
];

const bad = [];
for (const file of existing) {
  const src = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  if (patterns.some(rx => rx.test(src))) bad.push(file);
}

if (bad.length) {
  console.error('❌ Legacy guard failed. Realtime/socket code found in marketing pages:\n  - ' + bad.join('\n  - '));
  process.exit(1);
} else {
  console.log('✅ Legacy guard OK (no socket/realtime code in marketing pages).');
}

