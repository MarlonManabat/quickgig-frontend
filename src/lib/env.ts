import { z } from 'zod';

const Env = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE: z.string().optional()
});

export const env = Env.parse(process.env);

export function requireServer(key: keyof typeof env) {
  const val = env[key];
  if (!val && key !== 'SUPABASE_SERVICE_ROLE') throw new Error(`Missing env: ${String(key)}`);
  return val;
}
