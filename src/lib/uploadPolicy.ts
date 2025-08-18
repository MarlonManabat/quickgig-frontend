export const MAX_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ?? 2);
const ALLOWED = String(process.env.ALLOWED_UPLOAD_MIME || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export type UploadCheck = { ok: true } | { ok: false; reason: 'too_big' | 'bad_type' };

export function validateFile(file: File): UploadCheck {
  if (ALLOWED.length && !ALLOWED.includes(file.type)) return { ok: false, reason: 'bad_type' };
  const maxBytes = MAX_MB * 1024 * 1024;
  if (file.size > maxBytes) return { ok: false, reason: 'too_big' };
  return { ok: true };
}
