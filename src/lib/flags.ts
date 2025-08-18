import { env } from '@/config/env';

export const flags = {
  payments: env.NEXT_PUBLIC_ENABLE_PAYMENTS,
  gcash: env.NEXT_PUBLIC_ENABLE_GCASH,
  stripe: env.NEXT_PUBLIC_ENABLE_STRIPE,
};

