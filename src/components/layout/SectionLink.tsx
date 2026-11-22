"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

/**
 * Link to a home-page section. On the home page it smooth-scrolls with Lenis
 * (offset for the floating nav); elsewhere it navigates to `/#id`.
 * Pass `id="top"` to scroll to the very top.
 */
export function SectionLink({
  id,
  onNavigate,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  id: string;
  onNavigate?: () => void;
}) {
  const { scrollTo } = useSmoothScroll();
  const href = id === "top" ? "/" : `/#${id}`;

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (window.location.pathname !== "/") {
      onNavigate?.();
      return; // let Next.js navigate to /#id
    }
    e.preventDefault();
    history.replaceState(null, "", id === "top" ? "/" : `#${id}`);
    const go = () => scrollTo(id === "top" ? 0 : `#${id}`);
    if (onNavigate) {
      // e.g. closing the mobile menu: wait a frame so its cleanup restarts Lenis
      // and lifts the scroll lock (overflow: clip blocks programmatic scrolling).
      onNavigate();
      requestAnimationFrame(() => requestAnimationFrame(go));
    } else {
      go();
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
