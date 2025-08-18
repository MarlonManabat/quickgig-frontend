import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'tools', 'logs');
const logFile = path.join(logDir, 'upload.log');

export function logUpload(data: Record<string, unknown>) {
  const line = JSON.stringify({ ...data, ts: new Date().toISOString() });
  // eslint-disable-next-line no-console
  console.log(line);
  try {
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFile, line + '\n');
  } catch {
    // ignore
  }
}
