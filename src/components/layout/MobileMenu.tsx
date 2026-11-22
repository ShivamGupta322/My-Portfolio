"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Download, X } from "lucide-react";
import { navSections, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { SectionLink } from "./SectionLink";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Full-screen glass sheet for < lg. Locks scroll, traps focus, closes on Escape / link click. */
export function MobileMenu({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active: string | null;
}) {
  const { stop, start } = useSmoothScroll();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Focus the first link once the sheet has mounted.
    const raf = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(),
    );
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      start();
    };
  }, [open, onClose, stop, start]);

  function trapFocus(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          onKeyDown={trapFocus}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg/85 backdrop-blur-glass-lg lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: ease.outQuart }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-aurora" />

          <div className="container-page flex h-24 items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full shadow-none glass"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="container-page flex-1">
            <ol className="flex flex-col gap-2">
              {navSections.map((section, i) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: duration.base,
                    ease: ease.outExpo,
                    delay: 0.05 + i * 0.05,
                  }}
                >
                  <SectionLink
                    id={section.id}
                    onNavigate={onClose}
                    data-autofocus={i === 0 ? "" : undefined}
                    aria-current={active === section.id ? "location" : undefined}
                    className={cn(
                      "flex items-baseline gap-4 rounded-md py-2 font-display text-h2 transition-colors",
                      active === section.id ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    <span className="font-mono text-label text-primary-text">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.label}
                  </SectionLink>
                </motion.li>
              ))}
            </ol>
          </nav>

          <motion.div
            className="container-page flex flex-col gap-6 pt-10 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, delay: 0.35 }}
          >
            <a
              href={site.resume.fullStack}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-strong px-6 font-semibold text-white"
            >
              <Download aria-hidden className="size-[1.125em]" /> Download resume
            </a>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-small text-muted transition-colors hover:text-fg"
                  >
                    {s.label} <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
