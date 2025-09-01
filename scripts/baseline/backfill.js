#!/usr/bin/env node
/**
 * Backfill Product Baseline from git history.
 * - Reads docs/product/FEATURES.yml for ID→regex map
 * - Scans git log for merge commits & regular commits
 * - Groups matches per Feature ID
 * - Rewrites the section between <!-- BACKFILL:START --> and <!-- BACKFILL:END -->
 */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const featuresPath = path.join(root, 'docs/product/FEATURES.yml');
const baselinePath = path.join(root, 'docs/product/BASELINE.md');

function readFile(p){ return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; }
function writeFile(p,c){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c); }

function parseYaml(y){
  // minimal YAML parser for our simple list (avoid adding deps)
  return y.split('\n').reduce((acc, line) => {
    if (/^- id: /.test(line)) acc.push({ id: line.split(':')[1].trim() });
    else if (/^\s+name: /.test(line)) acc.at(-1).name = line.split(':')[1].trim();
    else if (/^\s+match: /.test(line)) acc.at(-1).match = line.split(':').slice(1).join(':').trim().replace(/^"|"$/g,'');
    return acc;
  }, []);
}

function sh(cmd){ return execSync(cmd, { encoding: 'utf8' }).trim(); }

const features = parseYaml(readFile(featuresPath));
if (!features.length) {
  console.error('No features found in FEATURES.yml'); process.exit(1);
}

// include merges (capture PR #) and normal commits
const log = sh(`git log --date=short --pretty=format:'%h|%ad|%s' --no-color --all`);
const lines = log.split('\n');

const groups = Object.fromEntries(features.map(f => [f.id, { meta: f, hits: [] }]));

for (const line of lines) {
  const [hash, date, subjectRaw] = line.split('|');
  const subject = subjectRaw || '';
  const pr = (subject.match(/#(\d+)/) || subject.match(/pull request #(\d+)/i) || [])[1];
  for (const f of features) {
    const re = new RegExp(f.match, 'i');
    if (re.test(subject)) {
      groups[f.id].hits.push({ hash, date, subject, pr: pr ? `#${pr}` : '' });
      break; // first feature wins
    }
  }
}

function renderTable(g){
  if (!g.hits.length) return `*(no matches found in history)*`;
  // Dedup by PR number or hash
  const seen = new Set();
  const rows = [];
  for (const h of g.hits) {
    const key = h.pr || h.hash;
    if (seen.has(key)) continue;
    seen.add(key);
    const link = h.pr || h.hash;
    rows.push(`| ${h.date} | ${link} | ${h.subject.replace(/\|/g,'/')} |`);
  }
  return [
    '| Date | Ref | Subject |',
    '|------|-----|---------|',
    ...rows.slice(0, 30), // keep it readable; newest first naturally by git log
  ].join('\n');
}

const stamp = new Date().toISOString().slice(0,10);
let block = `### Backfilled history (auto, ${stamp})\n\n`;
for (const f of features) {
  block += `#### ${f.id} — ${f.name}\n${renderTable(groups[f.id])}\n\n`;
}

// inject into BASELINE.md between markers
const baseline = readFile(baselinePath);
if (!baseline.includes('<!-- BACKFILL:START -->') || !baseline.includes('<!-- BACKFILL:END -->')) {
  console.error('Markers not found in BASELINE.md'); process.exit(1);
}
const updated = baseline.replace(
  /<!-- BACKFILL:START -->([\s\S]*?)<!-- BACKFILL:END -->/,
  `<!-- BACKFILL:START -->\n${block}<!-- BACKFILL:END -->`
);
writeFile(baselinePath, updated);

console.log('Updated BASELINE.md with backfilled history.');

