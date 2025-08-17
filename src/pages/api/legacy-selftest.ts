import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

type FileInfo = { exists: boolean; size?: number; sha256?: string; first200?: string };
type Resp = {
  env: {
    NEXT_PUBLIC_LEGACY_UI?: string;
    NEXT_PUBLIC_LEGACY_STRICT_SHELL?: string;
    NEXT_PUBLIC_SHOW_API_BADGE?: string;
  };
  files: Record<string, FileInfo>;
  alerts: string[];
};

const root = process.cwd();
const files = [
  'public/legacy/index.fragment.html',
  'public/legacy/login.fragment.html',
  'public/legacy/styles.css',
];

function info(rel: string): FileInfo {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return { exists: false };
  const buf = fs.readFileSync(full);
  const size = buf.length;
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  let first200 = '';
  try { first200 = buf.toString('utf8').replace(/\s+/g,' ').slice(0, 200); } catch {}
  return { exists: true, size, sha256, first200 };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  const resp: Resp = {
    env: {
      NEXT_PUBLIC_LEGACY_UI: process.env.NEXT_PUBLIC_LEGACY_UI,
      NEXT_PUBLIC_LEGACY_STRICT_SHELL: process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL,
      NEXT_PUBLIC_SHOW_API_BADGE: process.env.NEXT_PUBLIC_SHOW_API_BADGE,
    },
    files: {},
    alerts: [],
  };

  for (const f of files) resp.files[f] = info(f);

  // font presence (metadata only)
  const font = 'public/legacy/fonts/LegacySans.woff2';
  resp.files[font] = info(font);

  // placeholder alerts
  for (const f of files) {
    const fi = resp.files[f];
    if (fi.first200 && /lorem ipsum|placeholder|lipsum|TODO/i.test(fi.first200)) {
      resp.alerts.push(`Placeholder-looking content detected in ${f}`);
    }
  }

  res.status(200).json(resp);
}
