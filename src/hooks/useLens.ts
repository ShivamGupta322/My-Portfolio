"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LENS, isLens } from "@/lib/lens";
import type { Lens } from "@/types/content";

/**
 * Product ⇄ Systems lens, shared across the page without a provider.
 * Priority: ?lens= URL param → localStorage → default ("product").
 * The server always renders the default; the client switches after hydration
 * (useSyncExternalStore handles that without a hydration mismatch).
 */
const STORAGE_KEY = "lens";
const listeners = new Set<() => void>();
let current: Lens | null = null;

function readInitial(): Lens {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lens");
    if (isLens(fromUrl)) return fromUrl;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLens(stored)) return stored;
  } catch {
    /* storage/URL unavailable */
  }
  return DEFAULT_LENS;
}

function getSnapshot(): Lens {
  current ??= readInitial();
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLens(lens: Lens) {
  if (lens === current) return;
  current = lens;
  try {
    localStorage.setItem(STORAGE_KEY, lens);
    // Keep the URL shareable (?lens=systems) without adding history entries.
    const url = new URL(window.location.href);
    if (lens === DEFAULT_LENS) url.searchParams.delete("lens");
    else url.searchParams.set("lens", lens);
    history.replaceState(history.state, "", url);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useLens(): Lens {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_LENS);
}
