const DEFAULT_API_URL = 'https://api.quickgig.ph';

let base = process.env.NEXT_PUBLIC_API_URL;
if (!base) {
  if (process.env.VERCEL_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_API_URL is required in production');
  }
  console.warn('NEXT_PUBLIC_API_URL is not set; defaulting to https://api.quickgig.ph');
  base = DEFAULT_API_URL;
}

export const API_BASE_URL = base;
export const BASE = API_BASE_URL;
