import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og";

/**
 * "SG" monogram used for the browser-tab icon and the Apple touch icon:
 * white Space Grotesk letters on the brand violet → cyan gradient.
 * `radius` is a fraction of the size (iOS rounds its own corners, so 0 there).
 */
export function monogram(size: number, radius = 0.22) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: size * radius,
          background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 45%, #22D3EE 100%)",
          color: "#ffffff",
          fontFamily: "Space Grotesk",
          fontWeight: 700,
          fontSize: size * 0.5,
          letterSpacing: -size * 0.03,
          lineHeight: 1,
        }}
      >
        SG
      </div>
    ),
    { width: size, height: size, fonts: ogFonts() },
  );
}
