import { NextRequest } from 'next/server';
import { proxyPhp } from '@/lib/proxyPhp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS() { return new Response(null, { status: 204 }); }
export async function POST(req: NextRequest) { return proxyPhp(req, '/register.php'); }
