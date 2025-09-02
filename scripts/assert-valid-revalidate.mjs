import { promises as fs } from "fs";
import path from "path";
const roots = ["pages", "app"].filter(Boolean);

async function* walk(dir) {
  for (const dirent of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) yield* walk(res);
    else if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(dirent.name)) yield res;
  }
}

const issues = [];
for (const root of roots) {
  for await (const file of walk(root)) {
    const txt = await fs.readFile(file, "utf8").catch(() => "");
    // Heuristic: flag obviously invalid revalidate assignments
    const m = txt.match(/export\s+const\s+revalidate\s*=\s*([^\n;]+)/);
    if (m) {
      const val = m[1].trim();
      const ok = /^\d+$/.test(val) || /^(false|0|true)$/.test(val) || /^process\.env\./.test(val);
      if (!ok) issues.push(`${file}: suspicious revalidate=${val}`);
    }
  }
}

if (issues.length) {
  console.error("Invalid revalidate usage:\n" + issues.join("\n"));
  process.exit(1);
} else {
  console.log("revalidate assertions OK");
}

