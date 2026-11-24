"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

/**
 * Error boundary for the public site. Next 16 passes `error: unknown` and
 * `retry`. Production messages are generic by design; `digest` matches the
 * server log line.
 */
export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error
      ? String((error as { digest?: string }).digest)
      : null;

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-clip pt-32 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 bg-aurora"
      />
      <div className="container-page">
        <p className="font-mono text-label text-muted uppercase">Something went wrong</p>
        <h1 className="mt-4 text-h1">
          That didn&apos;t <span className="text-gradient">load</span>
        </h1>
        <p className="mt-5 max-w-[52ch] text-lead text-muted">
          An unexpected error stopped this page from rendering. Trying again usually fixes it.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <button type="button" onClick={() => retry()} className={buttonVariants({ size: "lg" })}>
            <RotateCcw aria-hidden /> Try again
          </button>
          <Link href="/" className={buttonVariants({ variant: "glass", size: "lg" })}>
            Back to home
          </Link>
        </div>
        {digest && <p className="mt-8 font-mono text-[0.75rem] text-muted">Reference: {digest}</p>}
      </div>
    </section>
  );
}
