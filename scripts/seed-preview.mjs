const { BASE_URL } = process.env;

if (!BASE_URL) {
  console.log('[seed-preview] skipping: BASE_URL not set');
  process.exit(0);
}

console.log(`[seed-preview] seeding for ${BASE_URL}`);

await import('./seed.mjs');

