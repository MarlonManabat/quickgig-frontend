import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const base = path.join(process.cwd(), 'public', 'legacy');
  const index = await fileExists(path.join(base, 'index.fragment.html'));
  const login = await fileExists(path.join(base, 'login.fragment.html'));
  const css = await fileExists(path.join(base, 'styles.css'));
  return NextResponse.json({ exists: true, index, login, css });
}

