import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { load } from 'cheerio';

const LEGACY_DIR = path.join(process.cwd(), 'public', 'legacy');
const legacyLogin = ['login', 'php'].join('.');

function sanitize(html: string): string {
  let out = html;

  // Normalize legacy login form actions to same-origin API and enforce POST
  const loginAbs = new RegExp(
    `action="(?:https?:\/\/)?(?:www\.)?quickgig\.ph\/${legacyLogin}"`,
    'gi'
  );
  const loginRel = new RegExp(`action="\/?${legacyLogin}"`, 'gi');
  out = out.replace(loginAbs, 'action="/api/session/login"');
  out = out.replace(loginRel, 'action="/api/session/login"');
  out = out.replace(
    /(<form[^>]*action="\/api\/session\/login"[^>]*)(>)/gi,
    (m, pre, post) => {
      if (/method=/i.test(pre)) {
        return pre.replace(/method="[^"]*"/i, 'method="post"') + post;
      }
      return pre + ' method="post"' + post;
    }
  );

  // Rewrite legacy login anchors to /login
  const hrefAbs = new RegExp(
    `href="(?:https?:\/\/)?(?:www\.)?quickgig\.ph\/${legacyLogin}"`,
    'gi'
  );
  const hrefRel = new RegExp(`href="\/?${legacyLogin}"`, 'gi');
  out = out.replace(hrefAbs, 'href="/login"');
  out = out.replace(hrefRel, 'href="/login"');

  // Normalize asset paths
  out = out.replace(/href="\/?css\/styles\.css"/gi, 'href="/legacy/styles.css"');
  out = out.replace(/(src|href)="\/?img\//gi, '$1"/legacy/img/');
  out = out.replace(/(src|href)="\/?fonts\//gi, '$1"/legacy/fonts/');

  // Remove remote scripts
  out = out.replace(/<script[^>]*src="(?:https?:)?\/\/[^"']+"[^>]*>\s*<\/script>/gi, '');

  return out;
}

function sanitizeBanner(html: string): string {
  const $ = load(html);
  $('script').remove();
  $('[onload],[onclick],[onerror],[onmouseover],[onfocus],[onblur]').each((_, el) => {
    Object.keys(el.attribs).forEach((attr) => {
      if (attr.startsWith('on')) $(el).removeAttr(attr);
    });
  });
  return $.root().html() || '';
}

function injectBanner(html: string): string {
  const banner = process.env.NEXT_PUBLIC_BANNER_HTML;
  if (!banner) return html;
  const safe = sanitizeBanner(banner);
  const $ = load(html);
  const slot = $('[data-banner-slot], #banner-slot, #legacy-banner-slot').first();
  if (slot.length) {
    slot.html(safe);
  } else if ($('header').length) {
    $('header').first().prepend(safe);
  } else {
    $.root().prepend(safe);
  }
  return $.html();
}

export async function renderFragment(kind: 'home' | 'login'): Promise<string> {
  const file = path.join(
    LEGACY_DIR,
    kind === 'home' ? 'index.fragment.html' : 'login.fragment.html'
  );
  try {
    const raw = await fs.readFile(file, 'utf8');
    let out = sanitize(raw);
    if (kind === 'home') {
      out = injectBanner(out);
    }
    return out;
  } catch {
    return '';
  }
}

