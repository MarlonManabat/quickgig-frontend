import { log } from '@/lib/log';
import nextPkg from 'next/package.json';
import appPkg from '../../../../package.json';

export const runtime = 'nodejs';

export async function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || null;
  const branch = process.env.VERCEL_GIT_COMMIT_REF || null;
  const buildTime = process.env.BUILD_TIME || null;
  const node = process.version;
  const next = nextPkg.version;
  const app = appPkg.version;
  log('[version]', { commit, branch, buildTime });
  return Response.json({
    ok: true,
    commit,
    branch,
    buildTime,
    node,
    next,
    app,
  });
}
