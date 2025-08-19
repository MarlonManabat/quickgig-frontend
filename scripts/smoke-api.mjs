#!/usr/bin/env node
/* eslint-disable no-console */

const BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.quickgig.ph').replace(/\/$/, '');
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 10000);

(async () => {
  try {
    const res = await fetch(BASE + '/status', { signal: controller.signal });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
    if (res.ok && data) process.exit(0);
    process.exit(1);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    clearTimeout(timer);
  }
})();
