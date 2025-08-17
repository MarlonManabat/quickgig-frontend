import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { resolveInputPath } from './lib/paths.mjs';

function showHelp() {
  console.log(`Legacy asset importer\n\nUsage: node tools/import_from_dir.mjs --from "<path>" [--dry-run]\n\nOptions:\n  --from <path>   Source directory containing legacy files\n  --dry-run       Ignore missing source (or set LEGACY_IMPORT_DRY_RUN=true)\n  --help          Show this message\n\nExamples:\n  node tools/import_from_dir.mjs --from "$HOME/Documents/QuickGig Project/frontend/public/legacy"\n  LEGACY_SRC="$HOME/Documents/QuickGig Project/frontend/public/legacy" npm run legacy:import\n  LEGACY_IMPORT_DRY_RUN=true npm run legacy:import -- --from "~/Documents/QuickGig Project/frontend/public/legacy"\n\nNote: wrap the path in quotes if it contains spaces.`);
}

/** Utility to recursively copy a directory */
async function copyDir(src, dest, files) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d, files);
    } else {
      await fsp.copyFile(s, d);
      files.push(d);
    }
  }
}

const args = process.argv.slice(2);
let fromArg;
let dryRun = process.env.LEGACY_IMPORT_DRY_RUN === 'true';
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--from') {
    fromArg = args[i + 1];
    i++;
  } else if (a === '--dry-run') {
    dryRun = true;
  } else if (a === '--help' || a === '-h') {
    showHelp();
    process.exit(0);
  }
}

if (!fromArg && process.env.LEGACY_SRC) {
  fromArg = process.env.LEGACY_SRC;
}

if (!fromArg) {
  if (dryRun) {
    console.log('legacy import (dry run): no source specified, skipping');
    process.exit(0);
  }
  console.error('Missing source directory. Use --from "<path>" or set LEGACY_SRC.');
  process.exit(1);
}

const srcDir = resolveInputPath(fromArg);
if (!fs.existsSync(srcDir)) {
  if (dryRun) {
    console.log(`legacy import (dry run): source not found at ${srcDir}, skipping`);
    process.exit(0);
  }
  console.error(`Source directory not found: ${srcDir}`);
  console.error('Tip: pass --from "<path>" or set LEGACY_SRC');
  process.exit(1);
}

const root = process.cwd();
const legacyDir = path.join(root, 'public', 'legacy');
await fsp.mkdir(legacyDir, { recursive: true });
await fsp.mkdir(path.join(legacyDir, 'img'), { recursive: true });
await fsp.mkdir(path.join(legacyDir, 'fonts'), { recursive: true });

const required = ['styles.css', 'index.fragment.html', 'login.fragment.html'];
for (const f of required) {
  if (!fs.existsSync(path.join(srcDir, f))) {
    console.error(`Required file not found in source: ${f}`);
    process.exit(1);
  }
}

const imported = [];
const rewrites = { img: 0, fonts: 0 };
const warnings = [];

function sanitizeFragment(html) {
  const $ = cheerio.load(html);
  $('script').remove();
  $('*').each((_, el) => {
    for (const attr of Object.keys(el.attribs || {})) {
      if (attr.startsWith('on')) $(el).removeAttr(attr);
    }
  });
  $('[src],[href]').each((_, el) => {
    for (const attr of ['src', 'href']) {
      const val = $(el).attr(attr);
      if (!val) continue;
      if (/^https?:\/\//i.test(val)) continue;
      if (val.startsWith('/legacy/img/')) continue;
      if (val.startsWith('/legacy/fonts/')) continue;
      if (val.startsWith('/img/')) {
        $(el).attr(attr, '/legacy' + val);
        rewrites.img++;
      } else if (val.startsWith('/assets/img/')) {
        $(el).attr(attr, '/legacy/img/' + val.slice('/assets/img/'.length));
        rewrites.img++;
      } else if (val.startsWith('/fonts/')) {
        $(el).attr(attr, '/legacy' + val);
        rewrites.fonts++;
      }
    }
  });
  let content = $('body').length ? $('body').html() || '' : $.root().html() || '';
  content = content.replace(/\r\n?/g, '\n').replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n').trim();
  return content + '\n';
}

for (const frag of ['index.fragment.html', 'login.fragment.html']) {
  const src = path.join(srcDir, frag);
  const dest = path.join(legacyDir, frag);
  const raw = await fsp.readFile(src, 'utf8');
  const out = sanitizeFragment(raw);
  await fsp.writeFile(dest, out, 'utf8');
  imported.push(dest);
}

await fsp.copyFile(path.join(srcDir, 'styles.css'), path.join(legacyDir, 'styles.css'));
imported.push(path.join(legacyDir, 'styles.css'));

const imgSrc = path.join(srcDir, 'img');
if (fs.existsSync(imgSrc)) {
  const files = [];
  await copyDir(imgSrc, path.join(legacyDir, 'img'), files);
  imported.push(...files);
} else {
  warnings.push('img directory missing');
}

const fontsSrc = path.join(srcDir, 'fonts');
if (fs.existsSync(fontsSrc)) {
  const files = [];
  await copyDir(fontsSrc, path.join(legacyDir, 'fonts'), files);
  imported.push(...files);
} else {
  warnings.push('fonts directory missing');
}

const rootEntries = fs.readdirSync(srcDir);
for (const name of rootEntries) {
  if (/^logo-.*\.png$/.test(name)) {
    const dest = path.join(legacyDir, name);
    await fsp.copyFile(path.join(srcDir, name), dest);
    imported.push(dest);
    if (name === 'logo-icon.png') {
      try {
        await fsp.copyFile(path.join(srcDir, name), path.join(root, 'public', 'favicon.png'));
        imported.push(path.join(root, 'public', 'favicon.png'));
      } catch {
        // ignore
      }
    }
  } else if (/^favicon\.\w+$/.test(name)) {
    const dest = path.join(legacyDir, name);
    await fsp.copyFile(path.join(srcDir, name), dest);
    imported.push(dest);
  }
}

console.log('\nImported files:');
console.table(imported.map((f) => ({ file: path.relative(root, f) })));
console.log('Rewrites:');
console.table(Object.entries(rewrites).map(([k, v]) => ({ kind: k, count: v })));
if (warnings.length) {
  console.warn('Warnings:');
  for (const w of warnings) console.warn(' - ' + w);
}
