import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { load } from 'cheerio';

const LEGACY_DIR = path.join(process.cwd(), 'public', 'legacy');
const legacyLogin = ['login', 'php'].join('.');

const REQUIRED_ASSETS = [
  'styles.css',
  'index.fragment.html',
  'login.fragment.html',
];
export function sanitizeLegacyHtml(html: string): string {
  const $ = load(html);

  // remove wrapping html/head/body and scripts
  $('html, head, body, script').each((_, el) => {
    const inner = $(el).html() || '';
    $(el).replaceWith(inner);
  });

  // strip inline event handlers
  $('[onload],[onclick],[onerror],[onmouseover],[onfocus],[onblur]').each((_, el) => {
    Object.keys(el.attribs).forEach((attr) => {
      if (attr.startsWith('on')) $(el).removeAttr(attr);
    });
  });

  // rewrite legacy login form actions
  $(`form[action*="${legacyLogin}"]`).each((_, el) => {
    $(el).attr('action', '/api/session/login');
  });

  // rewrite relative asset URLs to /legacy/
  $('*[src], *[href]').each((_, el) => {
    ['src', 'href'].forEach((attr) => {
      const val = $(el).attr(attr);
      if (!val) return;
      if (
        val.startsWith('/') ||
        val.startsWith('http') ||
        val.startsWith('#') ||
        val.startsWith('data:') ||
        val.startsWith('mailto:')
      )
        return;
      const cleaned = val.replace(/^\.\/?/, '');
      $(el).attr(attr, `/legacy/${cleaned}`);
    });
  });

  return $.root().html() || '';
}

export function loadFragment(name: 'index' | 'login' | 'header' | 'footer'): string {
  try {
    const file = path.join(LEGACY_DIR, `${name}.fragment.html`);
    const raw = readFileSync(file, 'utf8');
    return sanitizeLegacyHtml(raw);
  } catch {
    return '';
  }
}

export function injectLegacyStyles(html: string): string {
  if (html.includes('/legacy/styles.css')) return html;
  return `<link rel="stylesheet" href="/legacy/styles.css">\n${html}`;
}

export function verifyLegacyAssets(): string[] {
  return REQUIRED_ASSETS.filter((file) => !existsSync(path.join(LEGACY_DIR, file)));
}
