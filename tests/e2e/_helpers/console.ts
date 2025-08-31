import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function captureConsole(page: Page, filename = 'console-home.txt') {
  const folder = path.join(process.cwd(), 'test-results', 'console');
  fs.mkdirSync(folder, { recursive: true });
  const file = path.join(folder, filename);
  const out = fs.createWriteStream(file, { flags: 'a' });
  page.on('console', (msg) => {
    if (msg.type() === 'error') out.write(`[${msg.type()}] ${msg.text()}\n`);
  });
}
