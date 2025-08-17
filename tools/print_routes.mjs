import fs from 'fs';
try {
  const routes = fs.readFileSync('.next/routes-manifest.json','utf8');
  console.log('--- NEXT ROUTES MANIFEST ---');
  console.log(routes);
  console.log('----------------------------');
} catch (e) {
  console.warn('No routes-manifest found yet (build not run).');
}
