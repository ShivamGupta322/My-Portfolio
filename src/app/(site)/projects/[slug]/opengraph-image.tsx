import { ImageResponse } from "next/og";
import { getProjects } from "@/lib/content";
import { KIND_LABEL } from "@/lib/projectView";
import { OG_COLORS, OG_SIZE, OgFrame, ogFonts } from "@/lib/og";
import { getProjectView } from "@/lib/views";

export const alt = "Project case study by Shivam Gupta";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectView(slug);
  const fonts = ogFonts();

  if (!project) {
    return new ImageResponse(
      <OgFrame footer="devshivam.online">
        <div
          style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: 96, fontWeight: 700 }}
        >
          Case study
        </div>
      </OgFrame>,
      { ...size, fonts },
    );
  }

  const eyebrow = [`Case study`, KIND_LABEL[project.kind], project.companyName]
    .filter(Boolean)
    .join("  ·  ");

  return new ImageResponse(
    <OgFrame footer={`devshivam.online/projects/${slug}`}>
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
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: project.title.length > 22 ? 84 : 104,
            lineHeight: 1.02,
            letterSpacing: -3,
            maxWidth: 1050,
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            lineHeight: 1.35,
            color: OG_COLORS.muted,
            maxWidth: 1000,
          }}
        >
          {project.tagline}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
          {project.stack.slice(0, 5).map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 10,
                border: `1px solid ${OG_COLORS.border}`,
                backgroundColor: "rgba(255,255,255,0.06)",
                fontSize: 22,
                color: OG_COLORS.cyan,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </OgFrame>,
    { ...size, fonts },
  );
}
