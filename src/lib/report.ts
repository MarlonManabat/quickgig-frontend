export function report(error: unknown, context?: string) {
  // eslint-disable-next-line no-console
  console.error('[error]', { env: process.env.NEXT_PUBLIC_ENV, context, error });
}
