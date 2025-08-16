import { promises as fs } from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const LEGACY_DIR = path.join(process.cwd(), 'public', 'legacy');

function rewriteUrl(u: string) {
  // Keep absolute/external/data/mailto intact
  if (!u) return u;
  const s = u.trim();
  if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s) || /^mailto:/i.test(s) || s.startsWith('#')) return s;
  // Normalize to /legacy/… (strip leading "./", "/", etc.)
  return '/legacy/' + s.replace(/^(\.\/|\/)+/, '');
}

export async function loadLegacyFragment(kind: 'home' | 'login'): Promise<string> {
  const file = path.join(
    LEGACY_DIR,
    kind === 'home' ? 'index.fragment.html' : 'login.fragment.html'
  );
  try {
    const raw = await fs.readFile(file, 'utf8');
    const $ = cheerio.load(raw, { decodeEntities: false });

    // Rewrite src/href to serve from /legacy/
    $('[src]').each((_, el) => {
      const v = $(el).attr('src');
      if (v) $(el).attr('src', rewriteUrl(v));
    });
    $('[href]').each((_, el) => {
      const v = $(el).attr('href');
      if (v) $(el).attr('href', rewriteUrl(v));
    });

    // Normalize any legacy login PHP forms to same-origin API
    $('form').each((_, el) => {
      const action = ($(el).attr('action') || '').toLowerCase();
      const legacyLogin = 'login' + '.php';
      if (action.includes(legacyLogin) || action.includes('quickgig.ph/' + legacyLogin)) {
        $(el).attr('action', '/api/session/login');
        $(el).attr('method', 'post');
      }
    });

    return $.root().html() ?? '';
  } catch {
    return '';
  }
}
