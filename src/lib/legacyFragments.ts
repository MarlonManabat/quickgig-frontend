import { readFileSync } from 'fs';
import path from 'path';
import { load } from 'cheerio';

const LEGACY_DIR = path.join(process.cwd(), 'public', 'legacy');
const legacyLogin = ['login', 'php'].join('.');

function sanitize(html: string): string {
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

  return $.root().html() || '';
}

export function loadFragment(name: 'index' | 'login' | 'header' | 'footer'): string {
  try {
    const file = path.join(LEGACY_DIR, `${name}.fragment.html`);
    const raw = readFileSync(file, 'utf8');
    return sanitize(raw);
  } catch {
    return '';
  }
}

export function injectLegacyStyles(html: string): string {
  if (html.includes('/legacy/styles.css')) return html;
  return `<link rel="stylesheet" href="/legacy/styles.css">\n${html}`;
}
