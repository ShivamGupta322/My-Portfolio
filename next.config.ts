import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // Pin the root: a stray lockfile in the user's home dir otherwise confuses root detection.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// MDX is only imported (case studies in src/content/case-studies), never routed,
// so pageExtensions stay at the defaults.
const withMDX = createMDX({});

export default withMDX(nextConfig);
