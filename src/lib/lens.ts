import type { Lens } from "@/types/content";

/** Lens constants, kept tiny so client components don't pull in all content. */
export const LENSES: readonly Lens[] = ["product", "systems"];
export const DEFAULT_LENS: Lens = "product";

export function isLens(value: unknown): value is Lens {
  return value === "product" || value === "systems";
}
