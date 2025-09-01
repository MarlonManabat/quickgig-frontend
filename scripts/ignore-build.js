/**
 * Vercel ignoreCommand:
 * - exit(0)  => skip deployment
 * - exit(1+) => proceed with build
 *
 * We proceed only if runtime-relevant files changed.
 * You can force a deploy by including "[force deploy]" in the commit title/body
 * or setting env FORCE_VERCEL_DEPLOY=1 in the Vercel UI.
 */
const { execSync } = require('node:child_process');

function log(msg) { process.stdout.write(`${msg}\n`); }

try {
  // Force deploy knobs
  const forceEnv = process.env.FORCE_VERCEL_DEPLOY === '1';
  const commitMsg = (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').toLowerCase();
  const forceMsg = commitMsg.includes('[force deploy]');
  if (forceEnv || forceMsg) {
    log('force deploy requested -> proceed');
    process.exit(1);
  }

  // Base/head SHAs provided by Vercel
  const base = process.env.VERCEL_GIT_PREVIOUS_SHA || 'origin/main';
  const head = process.env.VERCEL_GIT_COMMIT_SHA || 'HEAD';

  // List changed files
  const diff = execSync(`git diff --name-only ${base} ${head}`, { encoding: 'utf8' })
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  if (!diff.length) {
    log('no changed files detected -> skip deploy');
    process.exit(0);
  }

  // Files that SHOULD trigger a build/deploy
  const shouldBuild = diff.some((p) => {
    return (
      // App/runtime code & assets
      /^src\//.test(p) ||
      /^app\//.test(p) ||
      /^public\//.test(p) ||
      // Package & lockfiles
      /^package(-lock)?\.json$/.test(p) ||
      /^pnpm-lock\.yaml$/.test(p) ||
      /^yarn\.lock$/.test(p) ||
      // Next/Vercel runtime config
      /^next\.config\.(js|mjs|cjs|ts)$/.test(p) ||
      /^vercel\.json$/.test(p) ||
      // TypeScript project config that may change build output
      /^tsconfig\.json$/.test(p) ||
      /^next-env\.d\.ts$/.test(p)
    );
  });

  if (shouldBuild) {
    log('runtime-relevant changes found -> proceed with deploy');
    process.exit(1);
  } else {
    log('only docs/CI/misc changes -> skip deploy');
    process.exit(0);
  }
} catch (err) {
  // On any error, proceed to avoid accidentally blocking a real deploy
  console.error('ignore-build error (proceeding with deploy):', err?.message || err);
  process.exit(1);
}
