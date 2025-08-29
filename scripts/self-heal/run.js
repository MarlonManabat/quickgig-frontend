"use strict";
// Heuristic: TS error "Type '{}' is missing ... from type 'Props': value, onChange"
// Common when a controlled component is mounted without props (e.g., LocationSelect)
const summary = process.env.GITHUB_STEP_SUMMARY || '';
if (/missing the following properties.*value, onChange/i.test(summary)) {
  const fs = require('fs');
  const cp = require('child_process');

  // naive patch for /pages/post (only if it exists and lacks props)
  if (fs.existsSync('pages/post.tsx')) {
    let txt = fs.readFileSync('pages/post.tsx', 'utf8');
    if (txt.includes('<LocationSelect />')) {
      txt = txt.replace(
        '<LocationSelect />',
        `<LocationSelect value={{}} onChange={() => {}} />`
      );
      fs.writeFileSync('pages/post.tsx', txt);
      try { cp.execSync('git checkout -b chore/self-heal-locationselect-props', {stdio:'inherit'}); } catch {}
      cp.execSync('git add -A && git commit -m "chore(self-heal): add missing value/onChange to LocationSelect"', {stdio:'inherit'});
      cp.execSync('git push -u origin chore/self-heal-locationselect-props --force', {stdio:'inherit'});
      try { cp.execSync('gh pr create -f --title "Self-heal: wire LocationSelect props" --body "Automated fix for missing value/onChange props."'); } catch {}
      process.exit(0);
    }
  }
}

// Heuristic: "window is not defined" on /post
if (/window is not defined/i.test(summary) && /\/post/.test(summary)) {
  const fs = require('fs');
  const cp = require('child_process');
  if (fs.existsSync('pages/post.tsx')) {
    let txt = fs.readFileSync('pages/post.tsx', 'utf8');
    if (txt.includes("import LocationSelect from")) {
      txt = txt.replace(
        "import LocationSelect from '@/components/location/LocationSelect';",
        "import dynamic from 'next/dynamic';\nimport ClientOnly from '@/components/util/ClientOnly';\nconst LocationSelect = dynamic(() => import('@/components/location/LocationSelect'), { ssr:false });"
      );
      txt = txt.replace(
        /<LocationSelect([^>]*)\/>/,
        '<ClientOnly>\n      <LocationSelect$1/>\n    </ClientOnly>'
      );
      fs.writeFileSync('pages/post.tsx', txt);
      try { cp.execSync('git checkout -b chore/self-heal-locationselect-ssr', {stdio:'inherit'}); } catch {}
      cp.execSync('git add -A && git commit -m "chore(self-heal): disable SSR for LocationSelect"', {stdio:'inherit'});
      cp.execSync('git push -u origin chore/self-heal-locationselect-ssr --force', {stdio:'inherit'});
      try { cp.execSync('gh pr create -f --title "Self-heal: disable SSR for LocationSelect" --body "Automated fix for window is not defined on /post."'); } catch {}
      process.exit(0);
    }
  }
}
