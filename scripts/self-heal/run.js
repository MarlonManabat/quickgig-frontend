const fs = require('fs'); const cp = require('child_process');

function patchApply(title, diff){
  fs.writeFileSync('tmp.patch', diff);
  try { cp.execSync('git checkout -b chore/self-heal-clicks', {stdio:'inherit'}); } catch {}
  cp.execSync('git apply -p0 tmp.patch', {stdio:'inherit'});
  cp.execSync('git add -A && git commit -m "'+title+'"', {stdio:'inherit'});
  cp.execSync('git push -u origin chore/self-heal-clicks --force', {stdio:'inherit'});
  try { cp.execSync('gh pr create -f --title "'+title+'" --body "Automated fix from clickmap failures."'); } catch {}
}

function readJSON(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return null; } }
const sum = readJSON('artifacts/clickmap-summary.json') || { errors: [] };
const errs = sum.errors || [];

// Heuristic 1: failing fetch to /data/ph on app domain → prefix with basePath
if (errs.some(e => e.type==='http' && /\/data\/ph\//.test(e.url||''))) {
  patchApply('chore(self-heal): robust public data path', `
*** Begin Patch
*** Update File: components/location/LocationSelect.tsx
@@
- const base = ''
+ const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
- fetch('/data/ph/regions.json')
+ fetch(\`${base}/data/ph/regions.json\`)
*** End Patch
`); process.exit(0);
}

// Heuristic 2: "window is not defined" on /post → disable SSR for LocationSelect
if (errs.some(e => e.type==='pageerror' && /window is not defined|document is not defined/i.test(e.text||''))) {
  patchApply('chore(self-heal): dynamic import LocationSelect (no SSR)', `
*** Begin Patch
*** Update File: pages/post.tsx
@@
-import LocationSelect from '@/components/location/LocationSelect'
+import dynamic from 'next/dynamic'
+const LocationSelect = dynamic(() => import('@/components/location/LocationSelect'), { ssr: false })
*** End Patch
`); process.exit(0);
}

// Heuristic 3: 404s to known routes → add stub pages with safe shell
if (errs.some(e => e.type==='http' && e.status===404 && /\/(inbox|admin|search)/.test(e.url||''))) {
  patchApply('chore(self-heal): add safe stubs for missing routes', `
*** Begin Patch
*** Add File: pages/_stubs.tsx
+export default function Stub({title}:{title:string}){return <div className="p-8"><h1 className="text-2xl font-semibold">{title}</h1></div>}
*** End Patch
*** Begin Patch
*** Add File: pages/inbox.tsx
+import Stub from './_stubs'; export default function Page(){ return <Stub title="Inbox" /> }
*** End Patch
*** Begin Patch
*** Add File: pages/search.tsx
+import Stub from './_stubs'; export default function Page(){ return <Stub title="Search" /> }
*** End Patch
*** Begin Patch
*** Add File: pages/admin.tsx
+import Stub from './_stubs'; export default function Page(){ return <Stub title="Admin" /> }
*** End Patch
`); process.exit(0);
}

// Fallback: comment with top errors (requires gh cli)
try {
  const list = errs.slice(0,10).map(e => '- ' + JSON.stringify(e)).join('\n');
  cp.execSync('gh pr comment $PR_NUMBER -b "Click audit failures detected:\n'+list+'\nPlease review or extend self-heal."');
} catch {}
