import { promises as fs } from 'fs';
import path from 'path';

export async function readLegacyFragment(relPath: string): Promise<string> {
  try {
    const full = path.join(process.cwd(), 'public', 'legacy', relPath);
    return await fs.readFile(full, 'utf8');
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException | undefined;
    if (error?.code === 'ENOENT') {
      console.warn(`[legacy] missing fragment: ${relPath}`);
      return '';
    }
    console.error(`[legacy] failed to read ${relPath}:`, err);
    return '';
  }
}

export async function legacyCssHref(): Promise<string | null> {
  // Prefer public/legacy/styles.css if present; otherwise NEXT_PUBLIC_LEGACY_CSS_URL; else null
  try {
    const local = path.join(process.cwd(), 'public', 'legacy', 'styles.css');
    await fs.access(local); // throws if not found
    return '/legacy/styles.css';
  } catch {
    const url = process.env.NEXT_PUBLIC_LEGACY_CSS_URL;
    return url && url.trim() ? url : null;
  }
}
