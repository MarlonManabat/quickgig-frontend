import { readFile } from 'node:fs/promises';
import fg from 'fast-glob';

async function main() {
  const files = await fg(['src/app/**/*.{ts,tsx}']);
  const invalid: { file: string; value: string }[] = [];

  for (const file of files) {
    const contents = await readFile(file, 'utf8');
    const match = contents.match(/export const revalidate\s*=\s*([^;\n]+)/);
    if (match) {
      const value = match[1].trim();
      if (!/^\d+$/.test(value) && value !== 'false') {
        invalid.push({ file, value });
      }
    }
  }

  if (invalid.length) {
    console.error('Invalid revalidate exports found:');
    for (const { file, value } of invalid) {
      console.error(`- ${file}: ${value}`);
    }
    process.exit(1);
  }
}

main();
