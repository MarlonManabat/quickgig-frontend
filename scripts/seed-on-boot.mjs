if (process.env.SEED_ON_BOOT === 'true') {
  try {
    await import('./seed.mjs');
  } catch (err) {
    console.error('[seed-on-boot] failed:', err);
  }
}

