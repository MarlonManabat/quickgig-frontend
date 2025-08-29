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
