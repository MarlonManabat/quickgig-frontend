import { execSync as sh } from 'node:child_process';

function run(cmd) {
  try {
    sh(cmd, { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

const parts = [];
if (run('node tools/smoke.mjs')) parts.push('product');
if (process.env.NEXT_PUBLIC_ENABLE_MESSAGES === 'true' && run('node tools/smoke_messages.mjs')) parts.push('messages');
if (process.env.NEXT_PUBLIC_ENABLE_S3_UPLOADS === 'true' && run('node tools/smoke_upload.mjs')) parts.push('upload');
console.log(`smoke:prod (${parts.join(', ')})`);
