import { env } from '@/config/env';

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
};

if (flags.beta) {
  flags.emails = true;
  flags.notifyCenter = true;
  flags.interviews = true;
  flags.interviewInvites = true;
  flags.interviewReminders = true;
  flags.payments = true;
}

