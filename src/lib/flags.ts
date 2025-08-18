import { env } from '@/config/env';

export const apiOrigin = (env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
export const engineMode = process.env.ENGINE_MODE || 'mock';
export const cookieStrategy: RequestCredentials = env.NEXT_PUBLIC_ENABLE_ENGINE_AUTH
  ? 'include'
  : 'omit';
export const apiOriginOk =
  !!apiOrigin &&
  (process.env.NODE_ENV !== 'production' || apiOrigin.startsWith('https://'));

if (!apiOriginOk) {
  // eslint-disable-next-line no-console
  console.error(
    `[flags] NEXT_PUBLIC_API_URL missing or not https in production: "${apiOrigin}"`
  );
}

export const flags = {
  beta: env.NEXT_PUBLIC_ENABLE_BETA_RELEASE,
  emails: env.NEXT_PUBLIC_ENABLE_EMAILS,
  notifyCenter: env.NEXT_PUBLIC_ENABLE_NOTIFY_CENTER,
  interviews: env.NEXT_PUBLIC_ENABLE_INTERVIEWS,
  interviewInvites: env.NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES,
  interviewReminders: env.NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS,
  payments: env.NEXT_PUBLIC_ENABLE_PAYMENTS,
  gcash: env.NEXT_PUBLIC_ENABLE_GCASH,
  stripe: env.NEXT_PUBLIC_ENABLE_STRIPE,
  paymentsLive: env.NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE,
};

const enableCore = () => {
  flags.emails = true;
  flags.notifyCenter = true;
  flags.interviews = true;
  flags.interviewInvites = true;
  flags.interviewReminders = true;
  flags.payments = true;
};

if (process.env.NODE_ENV === 'production') {
  enableCore();
}

if (flags.beta) {
  enableCore();
}

