#!/usr/bin/env node
// Backfill status snapshots for the past N days (default 7).
// No deps. Uses git log to summarize daily changes.
// Writes docs/status/status-YYYY-MM-DD.md
// Does NOT touch docs/status/latest.md for backfilled days.

import { execSync } from "node:child_process";
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const days = Number(process.argv[2] || "7");
if (!Number.isFinite(days) || days <= 0) {
  console.error("Usage: node scripts/status/backfill.mjs <days>  (e.g. 7)");
  process.exit(1);
}

const repoRoot = execSync("git rev-parse --show-toplevel").toString().trim();
const statusDir = join(repoRoot, "docs", "status");
mkdirSync(statusDir, { recursive: true });

function ymd(d) {
  const z = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
function mdPath(dateStr) {
  return join(statusDir, `status-${dateStr}.md`);
}
function header(dateStr) {
  return `# QuickGig Status — ${dateStr}

## What must stay true (current contract)
- Canonical app routes: **/browse-jobs**, **/post-job**, **/applications**, **/login**
- Legacy routes must redirect to canonical: **/post-jobs**, **/gigs/create** → **/post-job**
- Signed-out flows that land on **/login?next=<dest>** are considered **success** in smoke

`;
}

function renderCommits(sinceISO, untilISO) {
  const cmd = [
    `git log --since='${sinceISO}' --until='${untilISO}'`,
    `--pretty=format:'- %h %s (%an)'`,
  ].join(" ");
  try {
    const out = execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] })
      .toString()
      .trim();
    return out || "_No commits on this day._";
  } catch {
    return "_No commits on this day._";
  }
}

for (let i = days; i >= 1; i--) {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() - i);

  const next = new Date(day);
  next.setDate(day.getDate() + 1);

  const dateStr = ymd(day);
  const sinceISO = day.toISOString();
  const untilISO = next.toISOString();

  const file = mdPath(dateStr);

  // Build minimal snapshot with contract + commits summary
  const body = `${header(dateStr)}## Changes (code)
${renderCommits(sinceISO, untilISO)}

## Notes
- Backfilled snapshot; generated from git history for this date.
`;

  // Write only if content differs (idempotent)
  if (existsSync(file)) {
    const cur = readFileSync(file, "utf8");
    if (cur.trim() === body.trim()) {
      console.log(`Unchanged: ${file}`);
      continue;
    }
  }
  writeFileSync(file, body);
  console.log(`Wrote: ${file}`);
}

console.log("Backfill complete.");
