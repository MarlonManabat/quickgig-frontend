const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'https://app.quickgig.ph';

export const appUrl = (path = '/') => new URL(path, APP_ORIGIN).toString();
export const APP = { ORIGIN: APP_ORIGIN };
