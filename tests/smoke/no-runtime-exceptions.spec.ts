import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { goHome } from './_utils';

test('Landing renders without runtime exceptions', async ({ page }) => {
  const exceptions: Error[] = [];
  const consoleErrors: string[] = [];

  page.on('pageerror', (err) => {
    exceptions.push(err);
  });

  const IGNORE = [
    /favicon\.ico/i,
    /DevTools failed to load source map/i,
    /telemetry/i,
    /chrome-extension:\/\//i,
  ];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (!IGNORE.some((rx) => rx.test(text))) consoleErrors.push(text);
  });

  await goHome(page);

  const outDir = path.join(process.cwd(), 'test-results', 'artifacts', 'console');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'home.txt'), consoleErrors.join('\n'), 'utf8');

  expect(
    exceptions,
    `Unhandled exceptions on /:\n${exceptions.map((e) => e.message).join('\n')}`
  ).toHaveLength(0);
});
