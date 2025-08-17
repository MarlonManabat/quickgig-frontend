import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { legacyEnabled, getOverrideSource } from '@/lib/legacy';

type FileInfo = {
  exists: boolean;
  size: number;
  sha256: string | null;
  first200: string | null;
};

function sanitize(str: string): string {
  return str.replace(/[\u0000-\u001F\u007F<>]/g, '');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  legacyEnabled(req.url || '');
  const alerts: string[] = [];
  const base = process.cwd();
  const files = {
    index: 'public/legacy/index.fragment.html',
    login: 'public/legacy/login.fragment.html',
    styles: 'public/legacy/styles.css',
    font: 'public/legacy/fonts/LegacySans.woff2',
  } as const;

  const getInfo = (rel: string, text: boolean): FileInfo => {
    const fp = path.join(base, rel);
    try {
      const buf = fs.readFileSync(fp);
      const hash = crypto.createHash('sha256').update(buf).digest('hex');
      const info: FileInfo = { exists: true, size: buf.length, sha256: hash, first200: null };
      if (text) {
        const str = buf.toString('utf8');
        info.first200 = sanitize(str.slice(0, 200));
        if (/(lorem ipsum|placeholder|lipsum|TODO)/i.test(str)) {
          alerts.push(`${rel} contains placeholder text`);
        }
      }
      return info;
    } catch {
      return { exists: false, size: 0, sha256: null, first200: null };
    }
  };

  const data = {
    env: {
      NEXT_PUBLIC_LEGACY_UI: process.env.NEXT_PUBLIC_LEGACY_UI || null,
      NEXT_PUBLIC_LEGACY_STRICT_SHELL: process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL || null,
      NEXT_PUBLIC_SHOW_API_BADGE: process.env.NEXT_PUBLIC_SHOW_API_BADGE || null,
    },
    overrideSource: getOverrideSource(),
    index: getInfo(files.index, true),
    login: getInfo(files.login, true),
    styles: getInfo(files.styles, true),
    font: getInfo(files.font, false),
    alerts,
  };

  res.status(200).json(data);
}
