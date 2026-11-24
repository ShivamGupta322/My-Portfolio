import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";

/**
 * Shared pieces for generated Open Graph images (next/og → Satori).
 * Satori needs TTF/OTF/WOFF data, so fonts come from the @fontsource packages'
 * .woff files (Space Grotesk for display, DM Sans for body).
 */
export const OG_SIZE = { width: 1200, height: 630 };

const font = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

/*
 * Read once at module load, synchronously. Under Cache Components an async
 * file read inside the image handler would stop build-time prerendering and
 * make every OG image render on demand.
 */
const FONTS = [
  {
    name: "Space Grotesk",
    data: font("space-grotesk", "space-grotesk-latin-700-normal.woff"),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Space Grotesk",
    data: font("space-grotesk", "space-grotesk-latin-500-normal.woff"),
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "DM Sans",
    data: font("dm-sans", "dm-sans-latin-400-normal.woff"),
    weight: 400 as const,
    style: "normal" as const,
  },
];

export function ogFonts() {
  return FONTS;
}

export const OG_COLORS = {
  bg: "#07070c",
  fg: "#f4f4f8",
  muted: "#a1a1b5",
  violet: "#8b5cf6",
  violetText: "#a78bfa",
  cyan: "#22d3ee",
  border: "rgba(255,255,255,0.14)",
};

/** Ink background with the aurora glow, faint grid and a footer bar. */
export function OgFrame({ children, footer }: { children: ReactNode; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: OG_COLORS.bg,
        backgroundImage: [
          "radial-gradient(circle at 15% 20%, rgba(139,92,246,0.45), transparent 45%)",
          "radial-gradient(circle at 90% 85%, rgba(34,211,238,0.30), transparent 45%)",
          "radial-gradient(circle at 70% 10%, rgba(52,211,153,0.12), transparent 35%)",
        ].join(", "),
        color: OG_COLORS.fg,
        fontFamily: "DM Sans",
      }}
    >
      {children}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${OG_COLORS.border}`,
          paddingTop: 28,
          fontSize: 26,
          color: OG_COLORS.muted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `linear-gradient(135deg, ${OG_COLORS.violet}, ${OG_COLORS.cyan})`,
              color: OG_COLORS.bg,
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            SG
          </div>
          <span style={{ color: OG_COLORS.fg }}>Shivam Gupta</span>
        </div>
        <span>{footer}</span>
      </div>
    </div>
  );
}
