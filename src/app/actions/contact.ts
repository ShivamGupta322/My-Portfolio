"use server";

import { Resend } from "resend";
import { z } from "zod";
import { profile } from "@/content/profile";
import type { ContactField, ContactState } from "@/lib/contact";

/**
 * Contact form Server Action (docs/ARCHITECTURE.md §8).
 *  1. honeypot field filled → pretend success (bots learn nothing)
 *  2. submitted < 3 s after the form mounted → reject (scripted posts)
 *  3. zod validation → field errors, values echoed back so nothing is lost
 *  4. no RESEND_API_KEY / CONTACT_TO_EMAIL → "unavailable" + a prefilled mailto
 *  5. send with Resend, reply-to set to the visitor
 */

const trimmed = (v: unknown) => (typeof v === "string" ? v.trim() : v);

const schema = z.object({
  name: z.preprocess(
    trimmed,
    z
      .string({ error: "Please enter your name." })
      .min(2, "Please enter your name.")
      .max(80, "That name is a bit long (80 characters max)."),
  ),
  email: z.preprocess(
    trimmed,
    z.email({ error: "Please enter a valid email address." }).max(160, "That email is too long."),
  ),
  message: z.preprocess(
    trimmed,
    z
      .string({ error: "Please write a message." })
      .min(20, "A few more words, please (20 characters minimum).")
      .max(4000, "Please keep it under 4,000 characters."),
  ),
});

const MIN_FILL_MS = 3000;

function mailtoFor(values: { name: string; email: string; message: string }) {
  const subject = encodeURIComponent(`Hello from ${values.name || "your portfolio"}`);
  const body = encodeURIComponent(
    `${values.message}\n\n${values.name}${values.email ? ` <${values.email}>` : ""}`,
  );
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // 1. Honeypot: real people never see or fill this field.
  if (String(formData.get("company") ?? "").length > 0) return { status: "success" };

  // 2. Time on form.
  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return {
      status: "error",
      message: "That was very quick. Please check your message and send it again.",
      values,
    };
  }

  // 3. Validate.
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  // 4. Not configured yet: hand the visitor a ready-to-send email instead.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return { status: "unavailable", mailto: mailtoFor(parsed.data) };

  // 5. Send.
  const { name, email, message } = parsed.data;
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Portfolio: message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    if (error) throw new Error(error.message);
    return { status: "success" };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return {
      status: "error",
      message: "Sorry, your message couldn't be sent. You can email me directly instead.",
      mailto: mailtoFor(parsed.data),
      values,
    };
  }
}
