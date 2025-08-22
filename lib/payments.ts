export const TICKET_PRICE_PHP = Number(process.env.TICKET_PRICE_PHP || 10);
export const makeRef = () =>
  'QG' + Date.now().toString(36) + Math.random().toString(36).slice(2,6).toUpperCase();
export const canPostJob = (hasPaid: boolean) => hasPaid;
