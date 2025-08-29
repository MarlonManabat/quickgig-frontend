import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const fallbackDir = path.join(process.cwd(), '.vercel', 'output', 'static', 'api-fallback');
const fallbackFile = path.join(fallbackDir, 'jobs.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function readFallback(): Promise<any[]> {
  try {
    const txt = await fs.promises.readFile(fallbackFile, 'utf8');
    return JSON.parse(txt);
  } catch {
    return [];
  }
}

async function writeFallback(job: any) {
  try {
    await fs.promises.mkdir(fallbackDir, { recursive: true });
    const current = await readFallback();
    current.push(job);
    await fs.promises.writeFile(fallbackFile, JSON.stringify(current, null, 2));
  } catch {}
}

export async function GET() {
  const jobs: any[] = [];
  const supa = getSupabase();
  if (supa) {
    try {
      const { data } = await supa.from('jobs').select('*');
      if (Array.isArray(data)) jobs.push(...data);
    } catch {}
  }
  jobs.push(...(await readFallback()));
  jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const job = {
    id: Date.now().toString(),
    title: body.title,
    company: body.company,
    regionCode: body.regionCode,
    adminUnitCode: body.adminUnitCode,
    cityCode: body.cityCode,
    createdAt: new Date().toISOString(),
  };
  let saved = false;
  const supa = getSupabase();
  if (supa) {
    try {
      const { error } = await supa.from('jobs').insert(job);
      if (!error) saved = true;
    } catch {}
  }
  if (!saved) await writeFallback(job);
  return NextResponse.json(job);
}
