export const TICKET_PRICE_PHP = Number(process.env.TICKET_PRICE_PHP || 20);
export const FREE_TICKETS_ON_SIGNUP = Number(
  process.env.FREE_TICKETS_ON_SIGNUP || 3,
);

export const GCASH_PAYEE_NAME = process.env.GCASH_PAYEE_NAME || '';
export const GCASH_NUMBER = process.env.GCASH_NUMBER || '';
export const GCASH_QR_URL = process.env.GCASH_QR_URL || '/assets/gcash-qr.png';
export const GCASH_NOTES = process.env.GCASH_NOTES || '';

export const makeRef = () =>
  'QG' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6).toUpperCase();
export const canPostJob = (hasPaid: boolean) => hasPaid;
