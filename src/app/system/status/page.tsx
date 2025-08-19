import { env } from '@/config/env';
import SystemStatusClient from './SystemStatusClient';

export const dynamic = 'force-dynamic';

export default function StatusPage() {
  const envEntries = Object.entries(env).filter(([k]) => k.startsWith('NEXT_PUBLIC')) as [string, string][];
  return <SystemStatusClient envEntries={envEntries} jwtCookie={env.cookieName} />;
}
