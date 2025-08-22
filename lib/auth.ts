export const isAdmin = (email?: string) =>
  (process.env.ADMIN_EMAILS || '')
    .toLowerCase()
    .split(',')
    .map(s => s.trim())
    .includes((email || '').toLowerCase());
