import { profile } from "./profile";

/**
 * Layout-shell content (nav, footer, metadata). Identity comes from profile.ts so
 * there's one source of truth.
 */

export interface NavSection {
  id: string;
  label: string;
}

/** Order = page order. ids are the section anchors on the home page. */
export const navSections: readonly NavSection[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const site = {
  name: profile.name,
  initials: profile.initials,
  role: profile.role,
  tagline: "Full-stack, mobile & real-time systems.",
  location: profile.location,
  email: profile.email,
  copyrightYear: 2026,
  resume: {
    fullStack: profile.resume.product.href,
    erlang: profile.resume.systems.href,
  },
  socials: profile.socials,
} as const;
