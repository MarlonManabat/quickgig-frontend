import { env } from '@/config/env';

export function isAdmin(user?: { role?: string; email?: string } | null) {
  if (!user) return false;
  if (user.role && ['admin', 'moderator', 'staff'].includes(user.role.toLowerCase()))
    return true;
  if (user.email && env.ADMIN_EMAILS.includes(user.email)) return true;
  return false;
}

