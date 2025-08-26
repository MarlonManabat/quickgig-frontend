export type Payment = {
  id: string;
  user_id: string;
  amount_php: number;
  expected_tickets: number;
  gcash_reference: string;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export const PRICE = Number(process.env.NEXT_PUBLIC_TICKET_PRICE_PHP ?? 20);

export const TICKET_PRICE_PHP = PRICE;
export const FREE_TICKETS_ON_SIGNUP = Number(
  process.env.FREE_TICKETS_ON_SIGNUP || 3,
);

export const GCASH_PAYEE_NAME = process.env.GCASH_PAYEE_NAME || "";
export const GCASH_NUMBER = process.env.GCASH_NUMBER || "";
export const GCASH_QR_URL = process.env.GCASH_QR_URL || "/assets/gcash-qr.png";
export const GCASH_NOTES = process.env.GCASH_NOTES || "";

export const makeRef = () =>
  (process.env.PAYMENT_REF_PREFIX || "QG") +
  Date.now().toString(36) +
  Math.random().toString(36).slice(2, 6).toUpperCase();

export const canPostJob = (hasPaid: boolean) => hasPaid;

export function calcExpectedTickets(amountPhp: number) {
  return Math.floor(amountPhp / PRICE);
}
