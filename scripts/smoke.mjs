// scripts/smoke.mjs
/* Smoke test for local or configurable base.
   Usage:
     node scripts/smoke.mjs
     SMOKE_BASE=https://app.quickgig.ph node scripts/smoke.mjs
*/
import { execSync } from "node:child_process";

const HEADER_FILTER =
  /^(HTTP\/|content-type:|content-length:|server:|location:)/i;

function head(url) {
  return execSync(`curl -sSI ${url}`, { encoding: "utf8" });
}
function get(url) {
  return execSync(`curl -sS ${url}`, { encoding: "utf8" });
}
function showHead(url, label = url) {
  const lines = head(url)
    .split("\n")
    .filter((l) => HEADER_FILTER.test(l));
  console.log(`\n# HEAD ${label}\n${lines.join("")}`);
}

(async () => {
  const base = (process.env.SMOKE_BASE || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const ok = get(`${base}/api/health`).trim();
  console.log("# /api/health:", ok);

  // Show headers for base
  showHead(base + "/", base);
})();
