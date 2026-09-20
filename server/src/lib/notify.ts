/**
 * Pluggable notification senders.
 *
 * IMPORTANT — honest status: neither of these actually delivers anything
 * right now. Both fall back to `console.log`, which is enough to prove the
 * calling code (password reset, emergency-match alerts) is wired correctly,
 * but nobody receives a real email or SMS until you plug in a provider
 * below. This was a deliberate scope cut — a working notification service
 * needs an account + API key with a real provider, which can't be created
 * or tested from this sandbox.
 *
 * To make email real: sign up for Resend (or any SMTP provider), add
 * RESEND_API_KEY to .env, and replace the body of `sendEmail` with an API
 * call. To make SMS real: sign up for a Bangladeshi SMS gateway (SSL
 * Wireless, Elitbuzz, BulkSMSBD, etc.), add its credentials to .env, and
 * replace the body of `sendSms`.
 */

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

interface SmsPayload {
  to: string;
  message: string;
}

export async function sendEmail({ to, subject, text }: EmailPayload): Promise<void> {
  // TODO: replace with a real provider call (Resend, SMTP, etc.)
  console.log(`[email:stub] to=${to} subject="${subject}"\n${text}`);
}

export async function sendSms({ to, message }: SmsPayload): Promise<void> {
  // TODO: replace with a real SMS gateway call
  console.log(`[sms:stub] to=${to} message="${message}"`);
}
