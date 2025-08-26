// scripts/smoke-prod.mjs
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
  // App API health
  const ok = get("https://app.quickgig.ph/api/health").trim();
  console.log("# /api/health:", ok);

  // Landing + redirects
  showHead("https://quickgig.ph/", "quickgig.ph");
  showHead("https://www.quickgig.ph/", "www.quickgig.ph");
  showHead("https://quickgig.ph/post", "quickgig.ph/post");
})();
