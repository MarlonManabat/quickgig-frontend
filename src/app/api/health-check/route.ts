import { NextResponse } from 'next/server';
import { runHealthChecks } from '@/lib/health';

export async function GET() {
  const data = await runHealthChecks();
  return NextResponse.json(data);
}

