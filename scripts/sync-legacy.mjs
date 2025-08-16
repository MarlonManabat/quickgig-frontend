#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import cheerio from 'cheerio';

const ORIGIN = 'https://app.quickgig.ph';
const LEGACY_DIR = path.join(process.cwd(), 'public', 'legacy');

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

async function downloadBinary(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed asset ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, buf);
}

async function clearLegacyDir() {
  await fs.mkdir(LEGACY_DIR, { recursive: true });
  const entries = await fs.readdir(LEGACY_DIR);
  for (const e of entries) {
    if (e === '.keep') continue;
    await fs.rm(path.join(LEGACY_DIR, e), { recursive: true, force: true });
  }
}

async function rewriteCssUrls(css, baseUrl, assets) {
  const re = /url\(([^)]+)\)/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(css))) {
    out += css.slice(last, m.index);
    let ref = m[1].trim().replace(/^['"]|['"]$/g, '');
    if (!ref.startsWith('data:')) {
      const abs = new URL(ref, baseUrl);
      const rel = abs.pathname.replace(/^\//, '');
      await downloadBinary(abs.href, path.join(LEGACY_DIR, rel));
      assets.add(rel);
      ref = `/legacy/${rel}`;
    }
    out += `url(${ref})`;
    last = m.index + m[0].length;
  }
  out += css.slice(last);
  return out;
}

async function rewriteDomAssets($, pageUrl, assets) {
  for (const el of $('img[src]').toArray()) {
    const src = $(el).attr('src');
    if (!src || src.startsWith('data:')) continue;
    const abs = new URL(src, pageUrl);
    const rel = abs.pathname.replace(/^\//, '');
    await downloadBinary(abs.href, path.join(LEGACY_DIR, rel));
    assets.add(rel);
    $(el).attr('src', `/legacy/${rel}`);
  }
  for (const el of $('link[href]').toArray()) {
    const relAttr = ($(el).attr('rel') || '').toLowerCase();
    if (relAttr === 'stylesheet') continue;
    const href = $(el).attr('href');
    if (!href || href.startsWith('data:')) continue;
    const abs = new URL(href, pageUrl);
    const rel = abs.pathname.replace(/^\//, '');
    await downloadBinary(abs.href, path.join(LEGACY_DIR, rel));
    assets.add(rel);
    $(el).attr('href', `/legacy/${rel}`);
  }
  for (const el of $('source[srcset]').toArray()) {
    const srcset = $(el).attr('srcset');
    if (!srcset) continue;
    const parts = srcset.split(',').map(p => p.trim()).filter(Boolean);
    const outParts = [];
    for (const part of parts) {
      const [u, desc] = part.split(/\s+/);
      const abs = new URL(u, pageUrl);
      const rel = abs.pathname.replace(/^\//, '');
      await downloadBinary(abs.href, path.join(LEGACY_DIR, rel));
      assets.add(rel);
      outParts.push(`/legacy/${rel}` + (desc ? ` ${desc}` : ''));
    }
    $(el).attr('srcset', outParts.join(', '));
  }
}

async function extract(pathname, fragmentName, { sanitizeLogin = false } = {}) {
  const pageUrl = new URL(pathname, ORIGIN).href;
  const html = await fetchText(pageUrl);
  const $ = cheerio.load(html);

  $('script, noscript, iframe').remove();

  const cssParts = [];
  const assets = new Set();

  const links = $('link[rel="stylesheet"]').toArray();
  for (const el of links) {
    const href = $(el).attr('href');
    if (!href) continue;
    const cssUrl = new URL(href, pageUrl).href;
    let css = await fetchText(cssUrl);
    css = await rewriteCssUrls(css, cssUrl, assets);
    cssParts.push(css);
  }
  $('link[rel="stylesheet"]').remove();

  $('style').each((_, el) => {
    cssParts.push($(el).html() || '');
  });
  $('style').remove();

  await rewriteDomAssets($, pageUrl, assets);

  if (sanitizeLogin) {
    const form = $('form').first();
    if (form.length) {
      form.attr('method', 'post');
      form.attr('action', '/api/session/login');
      form.find('input[type="hidden"]').remove();
      const email = form.find('input[type="email"], input[name="email"]').first();
      if (email.length) email.attr('name', 'email');
      const pw = form.find('input[type="password"], input[name="password"]').first();
      if (pw.length) pw.attr('name', 'password');
    }
  }

  const fragment = $('body').html()?.trim() || '';
  await fs.writeFile(path.join(LEGACY_DIR, fragmentName), fragment);

  return { css: cssParts.join('\n'), assets };
}

async function main() {
  await clearLegacyDir();
  const cssParts = [];
  let assetCount = 0;
  const pages = [
    { path: '/', fragment: 'index.fragment.html' },
    { path: '/login', fragment: 'login.fragment.html', sanitizeLogin: true },
  ];
  for (const p of pages) {
    const { css, assets } = await extract(p.path, p.fragment, { sanitizeLogin: p.sanitizeLogin });
    cssParts.push(css);
    assetCount += assets.size;
  }
  await fs.writeFile(path.join(LEGACY_DIR, 'styles.css'), cssParts.join('\n'));
  console.log(`Legacy sync complete. CSS blocks: ${cssParts.length}, assets: ${assetCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
