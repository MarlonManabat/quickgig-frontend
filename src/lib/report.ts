import { env } from '@/config/env';

export function report(error: unknown, context?: string) {
  console.error('[error]', { env: env.NEXT_PUBLIC_ENV, context, error });
}
