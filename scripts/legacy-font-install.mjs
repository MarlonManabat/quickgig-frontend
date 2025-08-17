/**
 * Usage (run LOCALLY on your Mac):
 *   LEGACY_FONT_SRC="$HOME/Documents/QuickGig Project/frontend/public/legacy/fonts/LegacySans.woff2" npm run legacy:font:install
 * Notes:
 * - Handles paths with spaces.
 * - Verifies extension, size (>=10KB), prints SHA256, commits, and pushes current branch.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync as sh } from 'child_process';

const src = process.env.LEGACY_FONT_SRC;
if (!src) { console.error("Set LEGACY_FONT_SRC=/path/to/LegacySans.woff2"); process.exit(1); }
if (!fs.existsSync(src)) { console.error("File not found:", src); process.exit(1); }
if (!/\.woff2$/i.test(src)) { console.error("Expected a .woff2 file:", src); process.exit(1); }
const buf = fs.readFileSync(src);
if (buf.length < 10*1024) { console.error(`Font too small (${buf.length} bytes). Use the real .woff2.`); process.exit(1); }

const destDir = path.join(process.cwd(), 'public/legacy/fonts');
fs.mkdirSync(destDir, { recursive: true });
const dest = path.join(destDir, 'LegacySans.woff2');
fs.writeFileSync(dest, buf);

const sha = crypto.createHash('sha256').update(buf).digest('hex');
console.log("Copied font →", path.relative(process.cwd(), dest));
console.log("Size:", buf.length, "bytes");
console.log("SHA256:", sha);

try { sh('git add public/legacy/fonts/LegacySans.woff2 .gitattributes', { stdio: 'inherit' }); } catch {}
try { sh('git commit -m "fix(legacy): add real LegacySans.woff2 font (replace placeholder)"', { stdio: 'inherit' }); } catch {}
try { sh('git push -u origin HEAD', { stdio: 'inherit' }); } catch(e) {
  console.warn("Push failed; you can push manually:", e?.message || e);
}
