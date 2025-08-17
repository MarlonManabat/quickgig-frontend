import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import cheerio from 'cheerio';

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
const fromIdx = args.indexOf('--from');
if (fromIdx === -1 || !args[fromIdx + 1]) {
  console.error('Missing --from option. Example:\n  node tools/legacy/import_from_dir.mjs --from "../legacy-src"');
  process.exit(1);
}
const srcDir = path.resolve(args[fromIdx + 1]);

const required = ['styles.css', 'index.fragment.html', 'login.fragment.html'];
for (const f of required) {
  if (!fs.existsSync(path.join(srcDir, f))) {
    console.error(`Required file not found in source: ${f}`);
    process.exit(1);
  }
}

const root = process.cwd();
const legacyDir = path.join(root, 'public', 'legacy');
await fsp.mkdir(legacyDir, { recursive: true });

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

// copy logo root files
const rootEntries = fs.existsSync(srcDir) ? fs.readdirSync(srcDir) : [];
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
