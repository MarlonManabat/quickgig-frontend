import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

type FileInfo = {
  exists: boolean;
  url?: string;
  httpStatus?: number;
  size?: number;
  sha256?: string;
  first200?: string;
};

type Resp = {
  env: {
    NEXT_PUBLIC_LEGACY_UI?: string;
    NEXT_PUBLIC_LEGACY_STRICT_SHELL?: string;
    NEXT_PUBLIC_SHOW_API_BADGE?: string;
  };
  files: Record<string, FileInfo>;
  alerts: string[];
};

const LEGACY_PATHS = [
  '/legacy/index.fragment.html',
  '/legacy/login.fragment.html',
  '/legacy/styles.css',
  '/legacy/fonts/LegacySans.woff2',
];

function sha256(buf: Buffer | string) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  return crypto.createHash('sha256').update(b).digest('hex');
}

async function probeHttp(base: string, urlPath: string): Promise<FileInfo> {
  const url = `${base}${urlPath}`;
  try {
    const res = await fetch(url, { method: 'GET' }); // GET so we can read first200 if text
    const ct = res.headers.get('content-type') || '';
    const isText = /text\/|application\/(json|xml)/i.test(ct) || /\.html?$|\.css$/i.test(urlPath);
    let first200 = '';
    let size: number | undefined;

    if (isText) {
      const text = await res.text();
      size = Buffer.byteLength(text);
      first200 = text.replace(/\s+/g, ' ').slice(0, 200);
      return { exists: res.status < 400, url, httpStatus: res.status, size, first200, sha256: sha256(text) };
    } else {
      const buf = Buffer.from(await res.arrayBuffer());
      size = buf.length;
      return { exists: res.status < 400, url, httpStatus: res.status, size, sha256: sha256(buf) };
    }
  } catch {
    return { exists: false, url, httpStatus: 0 };
  }
}

function probeFs(projectRoot: string, urlPath: string): FileInfo {
  const rel = path.join('public', urlPath);
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) return { exists: false };
  const buf = fs.readFileSync(full);
  const size = buf.length;
  let first200 = '';
  try { first200 = buf.toString('utf8').replace(/\s+/g,' ').slice(0,200); } catch {}
  return { exists: true, size, sha256: sha256(buf), first200 };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  const env = {
    NEXT_PUBLIC_LEGACY_UI: process.env.NEXT_PUBLIC_LEGACY_UI,
    NEXT_PUBLIC_LEGACY_STRICT_SHELL: process.env.NEXT_PUBLIC_LEGACY_STRICT_SHELL,
    NEXT_PUBLIC_SHOW_API_BADGE: process.env.NEXT_PUBLIC_SHOW_API_BADGE,
  };

  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3000';
  const base = `${proto}://${host}`;

  const isVercel = !!process.env.VERCEL;
  const root = process.cwd();

  const files: Record<string, FileInfo> = {};

  for (const p of LEGACY_PATHS) {
    if (isVercel) {
      files[`public${p}`] = await probeHttp(base, p);
    } else {
      // Local dev: prefer fs, but also include URL for parity
      const fsInfo = probeFs(root, p);
      if (!fsInfo.exists) {
        files[`public${p}`] = await probeHttp(base, p);
      } else {
        files[`public${p}`] = { ...fsInfo, url: `${base}${p}`, httpStatus: fsInfo.exists ? 200 : 404 };
      }
    }
  }

  // Alerts if placeholder-looking content is detected in the fragments or CSS first200
  const alerts: string[] = [];
  for (const key of Object.keys(files)) {
    const info = files[key];
    if (info.first200 && /lorem ipsum|placeholder|lipsum|TODO/i.test(info.first200)) {
      alerts.push(`Placeholder-looking content detected in ${key}`);
    }
  }

  res.status(200).json({ env, files, alerts });
}
