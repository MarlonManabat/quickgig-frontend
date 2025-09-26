#!/usr/bin/env node
import { globby } from "globby";
import path from "node:path";
import fs from "node:fs";

const apis = await globby(["pages/api/**/*.ts", "src/app/api/**/route.ts"]);
const normalized = apis.map((p) => {
  if (p.startsWith("pages/api/")) return "api:" + p.replace(/^pages\/api\/|\.ts$/g, "");
  return "api:" + p.replace(/^src\/app\/api\/|\/route\.ts$/g, "");
});
const seen = new Set();
for (const k of normalized) {
  if (seen.has(k)) {
    console.error("❌ API route conflict between Pages and App Router for:", k);
    process.exit(1);
  }
  seen.add(k);
}
console.log("✅ No API route conflicts");

const APP_DIR = "src/app";
const conflicts = [];

function scan(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const hasPage = items.some((i) => /^page\.(t|j)sx?$/.test(i.name));
  const hasRoute = items.some((i) => /^route\.(t|j)s$/.test(i.name));
  if (hasPage && hasRoute) {
    conflicts.push(dir);
  }
  for (const item of items) {
    if (item.isDirectory()) {
      scan(path.join(dir, item.name));
    }
  }
}

if (fs.existsSync(APP_DIR)) {
  scan(APP_DIR);
}

if (conflicts.length) {
  console.error(
    "❌ Route conflict: page.* and route.* in same segment:",
    conflicts
  );
  process.exit(1);
}

console.log("✅ No page/route conflicts");
