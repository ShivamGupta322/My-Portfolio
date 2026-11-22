import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Cursor } from "@/components/layout/Cursor";
import { headInitScript } from "@/lib/initScript";
import { DEFAULT_THEME } from "@/lib/theme";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.devshivam.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shivam Gupta | Full Stack, Mobile & Erlang/OTP Engineer",
    template: "%s | Shivam Gupta",
  },
  description:
    "Software engineer building web and mobile apps with React, Next.js and React Native, and fault-tolerant real-time backends with Node.js and Erlang/OTP.",
  authors: [{ name: "Shivam Gupta", url: siteUrl }],
  creator: "Shivam Gupta",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Shivam Gupta",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07070c" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7fb" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/* Before first paint: saved theme + repeat-visit flag (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: headInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <a
          href="#main"
          className="fixed top-4 left-4 z-50 -translate-y-24 rounded-full px-5 py-3 text-small font-semibold glass transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>
          {children}
          <Cursor />
        </SmoothScrollProvider>
        <div aria-hidden className="noise-overlay" />
      </body>
    </html>
  );
}
