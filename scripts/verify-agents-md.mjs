#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const baseRef = process.env.GITHUB_BASE_REF || "main";

const changed = execSync(`git diff --name-only origin/${baseRef}...HEAD`, { stdio: "pipe" })
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean);

const mustTouchAgents = changed.some(p =>
  /^(src\/app\/lib\/routes\.ts|middleware\.ts|next\.config\.\w+|tests\/smoke\/|components\/.*PostJobSkeleton\.tsx)/.test(p)
);

const agents = readFileSync("docs/agents.md", "utf8");
const hasContract = agents.includes("AGENT CONTRACT");
const hasVersion = /Version:\s*\d{4}-\d{2}-\d{2}/.test(agents);

let failed = false;

if (!hasContract || !hasVersion) {
  console.error("❌ `docs/agents.md` is missing the AGENT CONTRACT header with a version stamp.");
  failed = true;
}

if (mustTouchAgents && !changed.includes("docs/agents.md")) {
  console.error("❌ You changed routes/middleware/smoke but didn’t update `docs/agents.md`.");
  console.error("   Please reflect the new contract at the top of `docs/agents.md` and bump the version date.");
  failed = true;
}

if (failed) process.exit(1);
console.log("✅ docs/agents.md contract present and consistent.");
