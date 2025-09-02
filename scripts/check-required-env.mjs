/* Production-only env guard to avoid cryptic "Digest" 500s. */
const PROD = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  // We use NextAuth in prod; enforce these only in prod:
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
];

if (PROD) {
  const missing = REQUIRED.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
  if (missing.length) {
    console.error('❌ Missing required production env vars:', missing.join(', '));
    process.exit(1);
  }
}

console.log('✅ Env check passed', PROD ? '(production)' : '(non-production)');
