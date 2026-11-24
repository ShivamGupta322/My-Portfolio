/**
 * Sends one test email with the same settings the contact form uses.
 *
 *   npm run test:email
 *
 * Reads RESEND_API_KEY, CONTACT_TO_EMAIL and (optional) CONTACT_FROM_EMAIL
 * from .env.local. See docs/SETUP_MEDIA_AND_EMAIL.md.
 */
import { Resend } from "resend";

const key = process.env.RESEND_API_KEY?.trim();
const to = process.env.CONTACT_TO_EMAIL?.trim();
const from = process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio <onboarding@resend.dev>";

function fail(message: string, hint?: string): never {
  console.error(`\n✗ ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

if (!key)
  fail(
    "RESEND_API_KEY is not set.",
    "Add it to .env.local (create a key at resend.com → API Keys).",
  );
if (!key.startsWith("re_"))
  fail("RESEND_API_KEY doesn't look like a Resend key (they start with re_).");
if (!to)
  fail(
    "CONTACT_TO_EMAIL is not set.",
    "Add the inbox that should receive contact messages to .env.local.",
  );

console.log(`Sending a test email\n  from: ${from}\n  to:   ${to}`);

const { data, error } = await new Resend(key).emails.send({
  from,
  to,
  replyTo: to,
  subject: "Portfolio contact form: test email",
  text: "If you can read this, the contact form on your portfolio is wired up correctly.\n\nSent by npm run test:email.",
});

if (error) {
  const hint = /domain/i.test(error.message)
    ? "The sender's domain isn't verified. Verify it in Resend → Domains, or leave CONTACT_FROM_EMAIL empty to use onboarding@resend.dev (delivers only to your Resend account's own email)."
    : /api key/i.test(error.message)
      ? "Check the key was copied completely and hasn't been revoked."
      : /testing emails|own email/i.test(error.message)
        ? "With the onboarding@resend.dev sender, CONTACT_TO_EMAIL must be the email you signed up to Resend with. Or verify your domain."
        : undefined;
  fail(`Resend refused the email: ${error.message}`, hint);
}

console.log(`\n✓ Sent (id ${data?.id}). Check ${to}, including spam.`);
