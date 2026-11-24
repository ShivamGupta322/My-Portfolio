"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the email address to the clipboard, with a short "Copied" confirmation. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the mailto link next to it still works */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email address copied" : "Copy email address"}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-glass-border bg-glass px-3 text-[0.75rem] font-medium text-muted transition-colors hover:border-fg/30 hover:text-fg"
    >
      {copied ? (
        <Check aria-hidden className="size-3.5 text-success" />
      ) : (
        <Copy aria-hidden className="size-3.5" />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
