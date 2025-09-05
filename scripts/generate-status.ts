import {execSync} from 'node:child_process';
import {writeFileSync, mkdirSync, existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import fg from 'fast-glob';

interface PR {
  number: number;
  title: string;
  mergedAt: string;
  url: string;
  additions: number;
  deletions: number;
  labels: string[];
}

const DAYS = parseInt(process.env.DAYS || '30', 10);
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN is required');
  process.exit(1);
}

const sinceDate = new Date(Date.now() - DAYS * 86400_000);
const sinceStr = sinceDate.toISOString().split('T')[0];

function getRepo() {
  const url = execSync('git config --get remote.origin.url', {encoding: 'utf8'}).trim();
  const match = url.match(/github.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/);
  if (!match) {
    throw new Error('Cannot parse repo from remote');
  }
  return {owner: match[1], repo: match[2]};
}

const {owner, repo} = getRepo();

async function gh(query: string, variables: Record<string, any>) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

async function fetchMergedPRs(): Promise<PR[]> {
  const query = `query($q:String!, $cursor:String){
    search(type:ISSUE, query:$q, first:100, after:$cursor){
      pageInfo{hasNextPage endCursor}
      nodes{... on PullRequest{number title mergedAt url additions deletions labels(first:20){nodes{name}}}}
    }
  }`;
  const q = `repo:${owner}/${repo} is:pr is:merged merged:>=${sinceStr}`;
  let cursor: string | null = null;
  const prs: PR[] = [];
  while (true) {
    const data = await gh(query, {q, cursor});
    const search = data.search;
    for (const node of search.nodes) {
      if (!node.mergedAt) continue;
      prs.push({
        number: node.number,
        title: node.title,
        mergedAt: node.mergedAt,
        url: node.url,
        additions: node.additions,
        deletions: node.deletions,
        labels: node.labels.nodes.map((n: any) => n.name.toLowerCase()),
      });
    }
    if (!search.pageInfo.hasNextPage) break;
    cursor = search.pageInfo.endCursor;
  }
  return prs;
}

async function fetchOpenPRs(): Promise<PR[]> {
  const query = `query($q:String!, $cursor:String){
    search(type:ISSUE, query:$q, first:50, after:$cursor){
      pageInfo{hasNextPage endCursor}
      nodes{... on PullRequest{number title url}}
    }
  }`;
  const q = `repo:${owner}/${repo} is:pr is:open`;
  let cursor: string | null = null;
  const prs: PR[] = [];
  while (true) {
    const data = await gh(query, {q, cursor});
    const search = data.search;
    for (const node of search.nodes) {
      prs.push({
        number: node.number,
        title: node.title,
        mergedAt: '',
        url: node.url,
        additions: 0,
        deletions: 0,
        labels: [],
      });
    }
    if (!search.pageInfo.hasNextPage) break;
    cursor = search.pageInfo.endCursor;
  }
  return prs;
}

function groupPRs(prs: PR[]): Record<string, PR[]> {
  const buckets = ["product","tickets","auth","db","migrations","ui","ci","docs","infra","chore","bugfix"];
  const grouped: Record<string, PR[]> = {};
  for (const pr of prs) {
    let bucket = buckets.find(b => pr.labels.includes(b));
    if (!bucket) bucket = 'other';
    if (!grouped[bucket]) grouped[bucket] = [];
    grouped[bucket].push(pr);
  }
  return grouped;
}

function parseBackfill(): {date:string; lines:string[]}[] {
  const file = readFileSync('docs/backfill.md', 'utf8');
  const lines = file.split('\n');
  const entries: {date:string; lines:string[]}[] = [];
  let current: {date: string; lines: string[]} | null = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(\d{4}-\d{2}-\d{2})/);
    if (m) {
      if (current) entries.push(current);
      current = {date: m[1], lines: []};
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) entries.push(current);
  const since = sinceDate.getTime();
  return entries.filter(e => new Date(e.date).getTime() >= since);
}

function changedMigrations(): string[] {
  try {
    const out = execSync(`git log --since="${sinceStr}" --name-only --pretty=format: supabase/migrations`, {encoding: 'utf8'});
    const files = Array.from(new Set(out.split('\n').filter(f => f.endsWith('.sql'))));
    return files;
  } catch {
    return [];
  }
}

function repoInventory() {
  const count = (pattern: string) => fg.sync(pattern, {onlyFiles: true}).length;
  const inventory: Record<string, number> = {
    api: count('src/app/api/**/*'),
    components: count('src/components/**/*'),
    lib: count('src/lib/**/*'),
  };
  if (existsSync('src/db')) {
    inventory.db = count('src/db/**/*');
  }
  return inventory;
}

function workflowNames(): string[] {
  const files = fg.sync(['.github/workflows/*.yml', '.github/workflows/*.yaml']);
  return files.map(f => {
    const content = readFileSync(f, 'utf8');
    const match = content.match(/^name:\s*(.+)$/m);
    return match ? match[1].trim() : f;
  });
}

function productChecklist() {
  const items = [
    {name: 'ticket_accounts table', type: 'migration', search: 'ticket_accounts'},
    {name: 'ticket_transactions table', type: 'migration', search: 'ticket_transactions'},
    {name: 'matches table', type: 'migration', search: 'matches'},
    {name: 'confirm_match function', type: 'migration', search: 'confirm_match'},
    {name: '/api/tickets/me route', type: 'route', path: 'src/app/api/tickets/me'},
    {name: '/api/matches (POST)', type: 'route', path: 'src/app/api/matches'},
    {name: '/api/matches/[id]/confirm', type: 'route', path: 'src/app/api/matches/[id]/confirm'},
  ];
  const migrationFiles = fg.sync('supabase/migrations/**/*.sql');
  const migrationContent = migrationFiles.map(f => readFileSync(f, 'utf8').toLowerCase()).join('\n');
  return items.map(it => {
    let found = false;
    if (it.type === 'migration') {
      found = migrationContent.includes(it.search.toLowerCase());
    } else {
      found = existsSync(it.path);
    }
    return {name: it.name, status: found ? 'FOUND' : 'MISSING'};
  });
}

function gapsFromChecklist(checklist: {name:string; status:string}[]): string[] {
  return checklist.filter(c => c.status === 'MISSING').map(c => `Add ${c.name}`);
}

(async () => {
  const merged = await fetchMergedPRs();
  const open = await fetchOpenPRs();
  if (merged.length === 0 && open.length === 0) {
    console.error('No data for status report');
    process.exit(1);
  }
  const grouped = groupPRs(merged);
  const totalAdd = merged.reduce((s, p) => s + p.additions, 0);
  const totalDel = merged.reduce((s, p) => s + p.deletions, 0);
  const backfill = parseBackfill();
  const migrations = changedMigrations();
  const inventory = repoInventory();
  const workflows = workflowNames();
  const checklist = productChecklist();
  const gaps = gapsFromChecklist(checklist).slice(0,3);

  const today = new Date().toISOString().split('T')[0];
  const lines: string[] = [];
  lines.push(`# Status for ${today}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(`- PRs merged: ${merged.length}`);
  lines.push(`- Additions: ${totalAdd}`);
  lines.push(`- Deletions: ${totalDel}`);
  lines.push(`- Repo inventory: api ${inventory.api}, components ${inventory.components}, lib ${inventory.lib}${inventory.db !== undefined ? `, db ${inventory.db}` : ''}`);
  lines.push('');

  lines.push('## Completed');
  const buckets = Object.keys(grouped);
  for (const bucket of buckets) {
    lines.push(`- **${bucket}**`);
    const prs = grouped[bucket].slice(0,10);
    for (const pr of prs) {
      lines.push(`  - [#${pr.number}](${pr.url}) ${pr.title}`);
    }
  }
  if (backfill.length) {
    lines.push('');
    lines.push('## Backfill');
    for (const entry of backfill) {
      lines.push(`- ${entry.date}`);
      for (const line of entry.lines.filter(l => l.trim().length)) {
        lines.push(`  ${line}`);
      }
    }
  }
  lines.push('');
  lines.push('## Notable migrations');
  if (migrations.length) {
    for (const m of migrations) lines.push(`- ${m}`);
  } else {
    lines.push('- None');
  }
  lines.push('');
  lines.push('## CI health');
  for (const w of workflows) lines.push(`- ${w}`);
  lines.push('');
  lines.push('## Product spec alignment');
  for (const c of checklist) {
    lines.push(`- ${c.name}: ${c.status}`);
  }
  lines.push('');
  lines.push('## Open PRs');
  if (open.length) {
    for (const pr of open) lines.push(`- [#${pr.number}](${pr.url}) ${pr.title}`);
  } else {
    lines.push('- None');
  }
  lines.push('');
  lines.push('## Gaps & Next 3 PRs');
  if (gaps.length) {
    for (const g of gaps) lines.push(`- ${g}`);
  } else {
    lines.push('- None');
  }
  lines.push('');

  const outPath = join('docs', 'status');
  if (!existsSync(outPath)) mkdirSync(outPath, {recursive: true});
  const filePath = join(outPath, `status-${today}.md`);
  writeFileSync(filePath, lines.join('\n'));
})();
