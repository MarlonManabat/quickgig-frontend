#!/usr/bin/env node
// Thin compatibility wrapper to avoid future path mismatches.
// Delegates to the canonical audit script.
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const target = resolve(__dirname, '../..', 'audit-agreements.mjs');
const url = pathToFileURL(target).href;
const { default: run } = await import(url);
// If the target exports a default function, call it; otherwise just importing runs it.
if (typeof run === 'function') {
  const args = process.argv.slice(2);
  const code = await run(args);
  if (typeof code === 'number') process.exit(code);
}
