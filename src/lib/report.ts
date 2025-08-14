export function report(error: unknown, context?: string) {
  const env = process.env.NEXT_PUBLIC_ENV || 'local';
  console.error('[error]', { env, context, error });
}
