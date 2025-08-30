import { z } from 'zod';

const Env = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE: z.string().optional()
});

export const env = Env.parse(process.env);

export type ServerEnvKeys = 'SUPABASE_SERVICE_ROLE' | 'SEED_ADMIN_EMAIL' | 'SEED_ADMIN_PASSWORD';

export function requireServer<K extends ServerEnvKeys>(key: K): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required server env: ${key}`);
  return v;
}
