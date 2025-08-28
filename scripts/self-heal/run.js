#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function readArtifacts(dir) {
  let content = '';
  if (!fs.existsSync(dir)) return content;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      content += readArtifacts(full);
    } else {
      try {
        content += fs.readFileSync(full, 'utf8') + '\n';
      } catch {
        // ignore unreadable files
      }
    }
  }
  return content;
}

const log = readArtifacts('artifacts');
const patches = [];

// existing heuristics would append patches here

if (/404[^\n]*\/data\/ph\//.test(log)) {
  patches.push([
    '*** Begin Patch',
    '*** Update File: components/location/LocationSelect.tsx',
    '@@',
    " const NCR_REGION_CODE = '130000000';",
    " const NCR_PROVINCE_CODE = 'NCR';",
    "+const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';",
    '@@',
    '         const [regions, provinces, cities] = await Promise.all([',
    "-          fetch('/data/ph/regions.json').then((r) => r.json()),",
    "-          fetch('/data/ph/provinces.json').then((r) => r.json()),",
    "-          fetch('/data/ph/cities.json').then((r) => r.json()),",
    "+          fetch(`\\${BASE}/data/ph/regions.json`).then((r) => r.json()),",
    "+          fetch(`\\${BASE}/data/ph/provinces.json`).then((r) => r.json()),",
    "+          fetch(`\\${BASE}/data/ph/cities.json`).then((r) => r.json()),",
    '         ]);',
    '*** End Patch',
  ].join('\n'));
}

if (/\/post[\s\S]*?(window|document) is not defined/.test(log)) {
  patches.push([
    '*** Begin Patch',
    '*** Update File: pages/post.tsx',
    '@@',
    '-import LocationSelect, { LocationValue } from "@/components/location/LocationSelect";',
    '+import dynamic from "next/dynamic";',
    '+import type { LocationValue } from "@/components/location/LocationSelect";',
    '+const LocationSelect = dynamic(() => import("@/components/location/LocationSelect"), { ssr: false });',
    '*** End Patch',
  ].join('\n'));
}

if (patches.length) {
  fs.writeFileSync('autofix.patch', patches.join('\n'));
}

