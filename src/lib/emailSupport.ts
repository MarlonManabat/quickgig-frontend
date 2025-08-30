import { sendTemplate } from "@/lib/email";

export async function notifySupportSubmission(to: string, subject: string) {
  await sendTemplate(to, "support-received", { subject });
}

export async function notifyDeletionRequested(to: string) {
  await sendTemplate(to, "account-deletion-requested", {});
}
