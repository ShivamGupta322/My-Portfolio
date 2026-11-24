import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.devshivam.online";

/** Home + every case study. (/design-system is internal and excluded.) */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...getProjects().map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
