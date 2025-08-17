import fs from 'fs';
import path from 'path';

const requiredFiles = [
  'public/legacy/index.fragment.html',
  'public/legacy/login.fragment.html',
  'public/legacy/styles.css',
];

const disallowed = /(lorem ipsum|placeholder|lipsum|TODO)/i;
const disallowedTag = /<script\b/i;
const disallowedHandler = /on\w+=/i;

let errors = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    errors.push(`missing required file: ${file}`);
  }
}

const htmlFiles = requiredFiles.filter(f => f.endsWith('.html'));
const cssFiles = requiredFiles.filter(f => f.endsWith('.css'));

for (const file of [...htmlFiles, ...cssFiles]) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  if (disallowed.test(content)) {
    errors.push(`disallowed placeholder in ${file}`);
  }
  if (file.endsWith('.html')) {
    if (disallowedTag.test(content)) {
      errors.push(`script tag found in ${file}`);
    }
    if (disallowedHandler.test(content)) {
      errors.push(`inline event handler found in ${file}`);
    }
  }
}

if (errors.length) {
  console.error('Legacy strict verify failed:\n' + errors.map(e => ` - ${e}`).join('\n'));
  process.exit(1);
} else {
  console.log('Legacy strict verify passed');
}
