import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const cwd = process.cwd();
const selfPath = 'scripts/audit-agreements.mjs';
const excludeDirs = new Set(['node_modules', '.next', '.git', 'audit']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (excludeDirs.has(entry.name)) return [];
        return walk(res);
      }
      return [res];
    })
  );
  return files.flat();
}

function rel(path) {
  return path.startsWith(cwd + '/') ? path.slice(cwd.length + 1) : path;
}

async function searchPaths(keyword) {
  const files = await walk(cwd);
  return files
    .filter((f) => f.includes(keyword) && rel(f) !== selfPath)
    .map(rel)
    .sort();
}

async function searchContent(regex) {
  const files = await walk(cwd);
  const hits = [];
  for (const file of files) {
    const r = rel(file);
    if (r === selfPath) continue;
    if (!/(\.ts|\.tsx|\.js|\.mjs|\.sql)$/i.test(file)) continue;
    const content = await readFile(file, 'utf8');
    if (regex.test(content)) hits.push(r);
  }
  return hits.sort();
}

async function main() {
  const timestamp = new Date().toISOString();

  const models = {};
  for (const name of ['applications', 'agreements', 'tickets']) {
    const paths = await searchPaths(name);
    models[name] = { found: paths.length > 0, paths };
  }

  const apiFiles = await searchPaths('src/app/api/');
  const apis = {
    applications_accept: {
      found: apiFiles.some((p) => /src\/app\/api\/applications\/.+\/accept\/route\.ts$/.test(p)),
      paths: apiFiles.filter((p) => /src\/app\/api\/applications\/.+\/accept\/route\.ts$/.test(p)),
    },
    agreements_confirm: {
      found: apiFiles.some((p) => /src\/app\/api\/agreements\/.+\/confirm\/route\.ts$/.test(p)),
      paths: apiFiles.filter((p) => /src\/app\/api\/agreements\/.+\/confirm\/route\.ts$/.test(p)),
    },
    agreements_cancel: {
      found: apiFiles.some((p) => /src\/app\/api\/agreements\/.+\/cancel\/route\.ts$/.test(p)),
      paths: apiFiles.filter((p) => /src\/app\/api\/agreements\/.+\/cancel\/route\.ts$/.test(p)),
    },
  };

  const logic = {
    create_agreement_from_application: {
      paths: await searchContent(/create[_-]?agreement[_-]?from[_-]?application/i),
    },
    tickets_debit: {
      paths: await searchContent(/tickets?[_-]?debit/i),
    },
    tickets_refund: {
      paths: await searchContent(/tickets?[_-]?refund/i),
    },
  };
  for (const key of Object.keys(logic)) {
    logic[key].found = logic[key].paths.length > 0;
  }

  const tests = {
    ticket_spend: { paths: await searchContent(/ticket.*spend/i) },
    ticket_refund: { paths: await searchContent(/ticket.*refund/i) },
    agreement_flow: { paths: await searchContent(/agreement.*(create|confirm|cancel)/i) },
  };
  for (const key of Object.keys(tests)) {
    tests[key].found = tests[key].paths.length > 0;
  }

  const result = { timestamp, models, apis, logic, tests, notes: [] };
  await mkdir('audit', { recursive: true });
  await writeFile('audit/agreements-scan.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
