"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Download, Menu } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navSections, site } from "@/content/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { duration, ease, spring } from "@/lib/motion";
import { MobileMenu } from "./MobileMenu";
import { SectionLink } from "./SectionLink";

const sectionIds = navSections.map((s) => s.id);

/**
 * Floating glass pill nav: condenses after 80px, hides while scrolling down and
 * reappears on scroll-up or keyboard focus. Active section shown by a shared
 * `layoutId` pill. Always visible under reduced motion.
 */
export function Nav() {
  const active = useActiveSection(sectionIds);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCondensed(y > 80);
    if (Math.abs(y - prev) > 4) setScrollHidden(y > 240 && y > prev);
  });

  // Activity keeps hidden routes mounted: never come back to an open menu.
  useLayoutEffect(() => () => setMenuOpen(false), []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const hidden = scrollHidden && !reducedMotion && !menuOpen;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? -128 : 0 }}
        transition={{ duration: duration.base, ease: ease.outExpo }}
        onFocusCapture={() => setScrollHidden(false)}
        className="fixed inset-x-4 top-4 z-20 mx-auto max-w-[1240px]"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex h-16 items-center justify-between gap-4 rounded-full pr-2 pl-5",
            "transition-[background-color,box-shadow,border-color] duration-300",
            condensed ? "shadow-card glass-strong" : "shadow-none glass",
          )}
        >
          <SectionLink
            id="top"
            aria-label={`${site.name}, back to top`}
            className="font-display text-h4 font-bold tracking-tight"
          >
            {site.initials}
            <span className="text-primary-text">.</span>
          </SectionLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {navSections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <SectionLink
                    id={section.id}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative isolate block rounded-full px-4 py-2 text-small font-medium transition-colors duration-200",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden
                        transition={spring.snappy}
                        className="absolute inset-0 -z-10 rounded-full bg-glass-strong ring-1 ring-glass-border"
                      />
                    )}
                    {section.label}
                  </SectionLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ButtonLink
              href={site.resume.fullStack}
              external
              size="md"
              className="hidden sm:inline-flex"
            >
              <Download aria-hidden /> Resume
            </ButtonLink>
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-glass lg:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
    </>
  );
}
