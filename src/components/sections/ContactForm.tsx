"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { sendContact } from "@/app/actions/contact";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { INITIAL_CONTACT_STATE, type ContactField } from "@/lib/contact";
import { duration, ease } from "@/lib/motion";

/**
 * Glass contact form wired to the `sendContact` Server Action via useActionState.
 * Success swaps in a confirmation panel ("Send another" remounts a fresh form);
 * when email isn't configured the visitor gets a prefilled mailto instead.
 */
export function ContactForm() {
  const [formKey, setFormKey] = useState(0);
  return <ContactFormInner key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(sendContact, INITIAL_CONTACT_STATE);
  const startedRef = useRef<HTMLInputElement>(null);

  // Time-on-form check: stamp when the form actually mounts in the browser
  // (the page itself is static, so a server-rendered value would be stale).
  // Re-stamp after every submission too: React resets form fields (including
  // this hidden one) when an action completes.
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, [state]);

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? state.values : undefined;
  const done = state.status === "success" || state.status === "unavailable";

  return (
    <div className="glass-gradient relative overflow-hidden rounded-xl p-6 glass md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
            className="flex min-h-[420px] flex-col items-start justify-center"
          >
            {state.status === "success" ? (
              <>
                <CheckCircle2 aria-hidden className="size-10 text-success" />
                <h3 className="mt-5 text-h3">Message sent</h3>
                <p className="mt-2 max-w-[44ch] text-muted">
                  Thanks for reaching out. I&apos;ll reply to the email address you gave.
                </p>
                <button
                  type="button"
                  onClick={onReset}
                  className={cn(buttonVariants({ variant: "glass", size: "md" }), "mt-8")}
                >
                  Send another message
                </button>
              </>
            ) : (
              <>
                <Mail aria-hidden className="size-10 text-primary-text" />
                <h3 className="mt-5 text-h3">Send it from your email</h3>
                <p className="mt-2 max-w-[48ch] text-muted">
                  The form isn&apos;t connected to email yet, so I&apos;ve put your message into a
                  ready-to-send email instead.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={state.status === "unavailable" ? state.mailto : "#"}
                    className={buttonVariants({ size: "md" })}
                  >
                    <Mail aria-hidden /> Open in your email app
                  </a>
                  <button
                    type="button"
                    onClick={onReset}
                    className={buttonVariants({ variant: "glass", size: "md" })}
                  >
                    Back to the form
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={action}
            noValidate
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
            className="flex flex-col gap-5"
            aria-describedby={state.status === "error" ? "contact-error" : undefined}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                name="name"
                label="Name"
                autoComplete="name"
                placeholder="Your name"
                error={errors.name}
                defaultValue={values?.name}
              />
              <Field
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                error={errors.email}
                defaultValue={values?.email}
              />
            </div>
            <Field
              name="message"
              label="Message"
              multiline
              placeholder="Tell me about the role, the project or the problem you're solving."
              error={errors.message}
              defaultValue={values?.message}
            />

            {/* Bot traps: a hidden field people never fill, and the mount timestamp. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <input ref={startedRef} type="hidden" name="startedAt" defaultValue="" />

            {state.status === "error" && (
              <p
                id="contact-error"
                role="alert"
                className="flex items-start gap-2 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-fg"
              >
                <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
                <span>
                  {state.message}
                  {state.mailto && (
                    <>
                      {" "}
                      <a
                        href={state.mailto}
                        className="font-semibold text-primary-text underline underline-offset-4"
                      >
                        Email me instead
                      </a>
                    </>
                  )}
                </span>
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <p className="text-[0.75rem] text-muted">
                All fields are required. Your email is only used to reply.
              </p>
              <button type="submit" disabled={pending} className={buttonVariants({ size: "lg" })}>
                {pending ? (
                  <>
                    <Loader2 aria-hidden className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <Send aria-hidden />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  multiline = false,
  placeholder,
  autoComplete,
  error,
  defaultValue,
}: {
  name: ContactField;
  label: string;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  defaultValue?: string;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    required: true,
    placeholder,
    defaultValue,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cn(
      "w-full rounded-md border bg-glass px-4 text-body text-fg placeholder:text-muted/70",
      "transition-[border-color,box-shadow] duration-200 outline-none",
      "focus:border-primary focus:shadow-[0_0_0_4px_rgb(139_92_246/0.2)]",
      error ? "border-danger" : "border-glass-border hover:border-fg/25",
    ),
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-label text-muted uppercase">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={6}
          className={cn(shared.className, "min-h-36 resize-y py-3 lg:min-h-56")}
        />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          className={cn(shared.className, "h-12")}
        />
      )}
      {error && (
        <p id={errorId} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
