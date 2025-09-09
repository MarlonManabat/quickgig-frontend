// scripts/status/report.mjs
import { execSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CANONICAL = [
  "/browse-jobs",
  "/post-job",
  "/applications",
  "/login",
];

function git(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}
function scanText(root, matcher) {
  const hits = [];
  (function walk(p) {
    for (const name of readdirSync(p)) {
      const fp = join(p, name);
      const st = statSync(fp);
      if (st.isDirectory()) {
        // Skip typical build and repo noise
        if ([".git", ".next", "node_modules", "test-results", "coverage"].includes(name)) continue;
        walk(fp);
      } else {
        if (!/\.(tsx?|jsx?|md|mdx|html|json|yml|yaml|mjs|cjs)$/.test(name)) continue;
        const txt = readFileSync(fp, "utf8");
        if (matcher.test(txt)) hits.push(fp);
      }
    }
  })(root);
  return Array.from(new Set(hits)).sort();
}

const rev = git("git rev-parse --short HEAD");
const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || git("git rev-parse --abbrev-ref HEAD");
const iso = new Date().toISOString();
const ymd = iso.slice(0, 10);

// Simple repo checks (non-blocking; just report)
const legacyRefs = scanText(process.cwd(), /\/gigs\/create\b/);
const heroCtas = scanText(process.cwd(), /data-testid=["']hero-cta-post-job["']/);
const navPostJob = scanText(process.cwd(), /data-testid=["']nav-post-job["']/);
const navBrowse = scanText(process.cwd(), /data-testid=["']nav-browse-jobs["']/);
const navApps = scanText(process.cwd(), /data-testid=["']nav-my-applications["']/);
const navLogin = scanText(process.cwd(), /data-testid=["']nav-login["']/);

// Compose summary lines
const findings = [
  `- Canonical routes: ${CANONICAL.join(", ")}`,
  `- Legacy '/gigs/create' references found: ${legacyRefs.length}`,
  legacyRefs.length ? `  - Files: ${legacyRefs.join(", ")}` : "",
  `- CTA testids present (files count): hero=${heroCtas.length}, nav-post-job=${navPostJob.length}, nav-browse=${navBrowse.length}, nav-applications=${navApps.length}, nav-login=${navLogin.length}`,
].filter(Boolean);

// Prepare snapshot doc
const snapshotPath = `docs/status/status-${ymd}.md`;
const snapshot = `# QuickGig Status — ${ymd}

**HEAD** \`${rev}\` on **${branch}\`  
Generated: ${iso}

## Contract (must stay true)
- Canonical app routes: ${CANONICAL.join(", ")}
- Auth-aware redirects to \`/login?next=<dest>\` are acceptable for gated pages in smokes.
- Legacy employer route \`/gigs/create\` is **not** canonical (middleware may redirect).

## Repo signals (informational)
${findings.join("\n")}

> Note: This snapshot is informational and does not modify application behavior.
`;

writeFileSync(snapshotPath, snapshot, "utf8");

// Also write GitHub Step Summary if available
const stepSummary = process.env.GITHUB_STEP_SUMMARY;
if (stepSummary) {
  const lines = [
    `# QuickGig Status Report`,
    ``,
    `**HEAD** \`${rev}\` on **${branch}** — ${iso}`,
    ``,
    `## Contract`,
    `- Canonical app routes: ${CANONICAL.join(", ")}`,
    `- Auth-aware redirects via /login?next=<dest> are counted as success in smokes`,
    `- Legacy /gigs/create is not canonical`,
    ``,
    `## Repo signals`,
    ...findings,
    ``,
    `Snapshot written to \`${snapshotPath}\`.`,
  ];
  writeFileSync(stepSummary, lines.join("\n"), { encoding: "utf8", flag: "a" });
}

console.log(`Wrote ${snapshotPath}`);
