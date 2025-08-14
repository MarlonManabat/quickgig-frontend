const url = 'https://app.quickgig.ph';

const res = await fetch(url);
const html = await res.text();

function extract(regex) {
  return [...html.matchAll(regex)].map(m => m[1]);
}

const anchors = extract(/<a\s+[^>]*href=["']([^"']+)["']/gi);
const buttons = extract(/<button\s+[^>]*data-cta=["']([^"']+)["']/gi);

console.log('a[href]');
for (const href of anchors) console.log(href);
console.log('\nbutton[data-cta]');
for (const cta of buttons) console.log(cta);
