import fs from 'node:fs/promises';
import path from 'node:path';
import { load, type Element } from 'cheerio';

const LEGACY_DIR = path.join(process.cwd(), 'public', 'legacy');
const CSS_PATH = '/legacy/styles.css';

export function sanitizeLegacyHtml(html: string): string {
  const $ = load(html, { decodeEntities: false }, false);

  $('script').remove();
  $('*').each((_, el) => {
    const attrs = (el as Element).attribs || {};
    for (const name of Object.keys(attrs)) {
      if (name.toLowerCase().startsWith('on')) {
        $(el).removeAttr(name);
      }
    }
  });

  const rewrite = (val: string): string => {
    if (/^https?:/i.test(val)) return val;
    if (val.startsWith('/img/')) return '/legacy' + val;
    if (val.startsWith('img/')) return '/legacy/' + val;
    if (val.startsWith('/fonts/')) return '/legacy' + val;
    if (val.startsWith('fonts/')) return '/legacy/' + val;
    return val;
  };

  $('[src],[href]').each((_, el) => {
    for (const attr of ['src', 'href']) {
      const val = $(el).attr(attr);
      if (!val) continue;
      $(el).attr(attr, rewrite(val));
    }
  });

  $('[srcset]').each((_, el) => {
    const val = $(el).attr('srcset');
    if (!val) return;
    const parts = val.split(',').map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/);
      const rewritten = rewrite(url);
      return descriptor ? `${rewritten} ${descriptor}` : rewritten;
    });
    $(el).attr('srcset', parts.join(', '));
  });

  return $.root().children().toString();
}

async function readFragment(name: string): Promise<string> {
  const file = path.join(LEGACY_DIR, `${name}.fragment.html`);
  const fragment = await fs.readFile(file, 'utf8');
  return sanitizeLegacyHtml(fragment);
}

function injectBanner(html: string): string {
  const bannerRaw = process.env.NEXT_PUBLIC_BANNER_HTML;
  if (!bannerRaw) return html;
  const safe = sanitizeLegacyHtml(bannerRaw);
  return safe + html;
}

async function withStyles(html: string): Promise<string> {
  // Ensure CSS file exists
  await fs.readFile(path.join(LEGACY_DIR, 'styles.css'), 'utf8');
  const links = `<link rel="preload" as="style" href="${CSS_PATH}"><link rel="stylesheet" href="${CSS_PATH}">`;
  return links + html;
}

export async function renderLegacyHome(): Promise<string> {
  const content = await readFragment('index');
  const withBanner = injectBanner(content);
  return withStyles(withBanner);
}

export async function renderLegacyLogin(): Promise<string> {
  let content = await readFragment('login');
  const $ = load(content, { decodeEntities: false });
  $('form').attr('action', '/api/session/login');
  content = $.root().children().toString();
  const withBanner = injectBanner(content);
  return withStyles(withBanner);
}

