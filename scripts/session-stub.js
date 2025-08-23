import { mkdirSync, writeFileSync } from 'fs';

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'demo-admin@quickgig.test';
const data = { user: 'demo-user@quickgig.test', admin: adminEmail };

mkdirSync('test-results', { recursive: true });
writeFileSync('test-results/demo-session.json', JSON.stringify(data));
console.log('Session stub written');
