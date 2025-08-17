import fs from 'fs';
try {
  const s = fs.readFileSync('.next/routes-manifest.json','utf8');
  console.log('\n--- NEXT ROUTES MANIFEST ---\n' + s + '\n----------------------------\n');
} catch {
  console.log('No routes-manifest.json (build may have failed).');
}
