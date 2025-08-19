const DEFAULT_API_URL = 'https://api.quickgig.ph';

const base = process.env.NEXT_PUBLIC_API_URL;
if (!base && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_API_URL is required in production');
}

export const API_BASE_URL = base || DEFAULT_API_URL;
export const BASE = API_BASE_URL;
