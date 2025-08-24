import { getAppRoot } from './appUrl';
export const APP_URL = getAppRoot();
export const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'https://quickgig.ph';
