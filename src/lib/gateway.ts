import { env } from '@/config/env';

const TIMEOUT_MS = 15_000;

export async function gateFetch(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `${env.API_URL}${path}`;
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}
