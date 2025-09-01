import { safeNext } from './safe-next';

export const nextOr = (raw: string | undefined | null, fallback: string) =>
  safeNext(raw) ?? fallback;
