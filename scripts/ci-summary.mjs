import { readFile } from "node:fs/promises";

async function counts(path) {
  try {
    const json = JSON.parse(await readFile(path, "utf8"));
    let passed = 0;
    let failed = 0;
    const visit = (node) => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== "object") return;
      if (node.status === "passed") passed += 1;
      if (node.status === "failed") failed += 1;
      Object.values(node).forEach(visit);
    };
    visit(json);
    return { passed, failed };
  } catch {
    return { passed: 0, failed: 1 };
  }
}

const smoke = await counts("playwright-report/smoke/data/report.json");
const e2e = await counts("playwright-report/e2e/data/report.json");

const preview = process.env.BASE_URL || "";
const runUrl = `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;

const fmt = (name, r) =>
  `${r.failed ? "❌" : "✅"} ${name}: ${r.passed} passed, ${r.failed} failed`;

let md = `### Release check\n\n`;
md += `- Preview: ${preview ? `[${preview}](${preview})` : "n/a"}\n`;
md += `- ${fmt("Smoke", smoke)}\n`;
md += `- ${fmt("E2E", e2e)}\n`;
md += `- [Artifacts](${runUrl})\n`;

console.log(md);
