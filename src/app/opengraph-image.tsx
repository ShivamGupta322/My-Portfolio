import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { OG_COLORS, OG_SIZE, OgFrame, ogFonts } from "@/lib/og";

export const alt = "Shivam Gupta: full-stack, mobile and Erlang/OTP engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const roles = [...profile.lens.product.roles.slice(0, 3), "Erlang/OTP"];
  return new ImageResponse(
    <OgFrame footer="devshivam.online">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: OG_COLORS.violetText,
          }}
        >
          {profile.role}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          Shivam&nbsp;
          <span
            style={{
              backgroundImage: `linear-gradient(90deg, ${OG_COLORS.violetText}, ${OG_COLORS.cyan})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Gupta
          </span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            color: OG_COLORS.muted,
            maxWidth: 940,
          }}
        >
          I build the apps and the real-time systems behind them.
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          {roles.map((r) => (
            <div
              key={r}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: `1px solid ${OG_COLORS.border}`,
                backgroundColor: "rgba(255,255,255,0.06)",
                fontSize: 24,
              }}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    </OgFrame>,
    { ...size, fonts: ogFonts() },
  );
}
