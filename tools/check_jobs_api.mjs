#!/usr/bin/env node
/* eslint-disable no-console */

const BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph').replace(/\/$/, '');

(async () => {
  try {
    const res = await fetch(BASE + '/jobs');
    const data = await res.json();
    if (Array.isArray(data)) {
      console.log('Jobs API OK');
      process.exit(0);
    }
    console.error('Unexpected response:', data);
    process.exit(1);
  } catch (err) {
    console.error('Jobs check failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
})();
