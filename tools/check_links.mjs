const base = (process.env.BASE || 'http://localhost:3000').replace(/\/$/, '');
const start = ['/', '/find-work'];
const visited = new Set();
const broken = [];

async function crawl(path) {
  if (visited.has(path)) return;
  visited.add(path);
  try {
    const res = await fetch(base + path);
    if (!res.ok) {
      broken.push(`${path} -> ${res.status}`);
      return;
    }
    const html = await res.text();
    const links = [...html.matchAll(/href="(\/[^"#?]+)"/g)].map((m) => m[1]);
    for (const l of links) {
      if (l.startsWith('/')) await crawl(l);
    }
  } catch (e) {
    broken.push(`${path} -> ${e}`);
  }
}

(async () => {
  for (const s of start) await crawl(s);
  broken.forEach((b) => console.log('❌', b));
  console.log(`Checked ${visited.size} links, broken ${broken.length}`);
})();
