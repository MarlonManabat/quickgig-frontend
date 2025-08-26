// lib/email.ts
// Minimal placeholder for transactional emails.
// Replace with real provider integration (Resend, Postmark, etc.) later.

export async function sendTemplate(
  to: string,
  template: string,
  data: Record<string, any>,
): Promise<void> {
  console.log("sendTemplate mock:", { to, template, data });
  // TODO: integrate actual email provider
}
