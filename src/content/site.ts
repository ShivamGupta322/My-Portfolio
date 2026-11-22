/**
 * Site-wide content used by the layout shell (nav, footer, metadata).
 * Fuller profile/experience/project data arrives in Phase 3 (src/content/*.ts).
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
  name: "Shivam Gupta",
  initials: "SG",
  role: "Software Engineer",
  tagline: "Full-stack, mobile & real-time systems.",
  location: "Bareilly, Uttar Pradesh, India",
  email: "guptashivamsg02@gmail.com",
  copyrightYear: 2026,
  resume: {
    fullStack: "/resume/Shivam_Gupta_FullStack.pdf",
    erlang: "/resume/Shivam_Gupta_Erlang.pdf",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/ShivamGupta322" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shivam-gupta-sg322/" },
    { label: "LeetCode", href: "https://leetcode.com/u/Shivam_Gupta322/" },
    { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/user/guptashivamsg02/" },
  ],
} as const;
