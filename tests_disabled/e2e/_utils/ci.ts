import { test } from '@playwright/test';

export function requireEnvOrSkip(name: string): string {
  const v = process.env[name];
  test.skip(!v, `missing ${name}`);
  return v!;
}
