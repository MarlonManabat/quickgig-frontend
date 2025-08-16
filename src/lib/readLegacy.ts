import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function readLegacy(file: string) {
  const full = path.join(process.cwd(), 'public', 'legacy', file);
  try {
    return await readFile(full, 'utf8');
  } catch {
    // Friendly fallback that makes it obvious which file is missing
    return `<!-- Missing /public/legacy/${file}. Put the body fragment here. -->`;
  }
}
