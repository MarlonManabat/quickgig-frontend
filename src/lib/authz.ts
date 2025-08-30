export function isAdminEmail(email?: string | null) {
  const raw = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!email && raw.includes(email.toLowerCase());
}
