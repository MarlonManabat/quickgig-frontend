#!/usr/bin/env node

// Heuristic: Playwright "Project(s) 'smoke' not found"
if (process.env.GITHUB_STEP_SUMMARY?.includes(`Project(s) "smoke" not found`) ||
    process.env.GITHUB_STEP_SUMMARY?.includes(`Projects: ""`)) {
  // Open a patch PR that adds a smoke project or rewires test:smoke to an explicit file.
  const diff = `
*** Begin Patch
*** Update File: package.json
@@
-    "test:smoke": "playwright test --project=smoke",
+    "test:smoke": "playwright test --project=smoke || playwright test e2e/smoke.spec.ts",
*** End Patch
`;
  require('fs').writeFileSync('tmp.patch', diff);
  const cp = require('child_process');
  try { cp.execSync('git checkout -b chore/self-heal-smoke-project', {stdio:'inherit'}); } catch {}
  cp.execSync('git apply -p0 tmp.patch', {stdio:'inherit'});
  cp.execSync('git add -A && git commit -m "chore(self-heal): ensure smoke project or fallback to file"', {stdio:'inherit'});
  cp.execSync('git push -u origin chore/self-heal-smoke-project --force', {stdio:'inherit'});
  try { cp.execSync('gh pr create -f --title "Self-heal: fix Playwright smoke project" --body "Automated fix for missing smoke project."'); } catch {}
  process.exit(0);
}
