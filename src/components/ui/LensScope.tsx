"use client";

import type { ComponentProps } from "react";
import { useLens } from "@/hooks/useLens";

/**
 * Sets data-current-lens on a wrapper so server-rendered children can react to
 * the Product ⇄ Systems lens with plain CSS (see "Lens highlighting" in globals.css).
 */
export function LensScope(props: ComponentProps<"div">) {
  const lens = useLens();
  return <div data-current-lens={lens} {...props} />;
}
