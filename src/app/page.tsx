import { ArrowUpRight, Palette } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Phase 1 placeholder. Replaced by the real Hero/sections in Phase 4. */
export default function Home() {
  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 animate-aurora-drift bg-aurora"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />

      <header className="container-page flex items-center justify-between pt-8">
        <span className="font-display text-h4 font-bold">
          SG<span className="text-primary-text">.</span>
        </span>
        <ThemeToggle />
      </header>

      <main id="main" className="container-page flex flex-1 flex-col justify-center py-24">
        <Badge variant="in-progress" className="self-start">
          Rebuilding · Phase 1
        </Badge>
        <h1 className="mt-8 text-display">
          Shivam <span className="text-gradient">Gupta</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-lead text-muted">
          Full-stack &amp; mobile engineer shipping apps to Play Store and App Store, and building
          fault-tolerant, real-time backends in Node.js and Erlang/OTP.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/design-system">
            <Palette aria-hidden /> Design system
          </ButtonLink>
          <ButtonLink href="https://www.devshivam.online" variant="glass">
            Current site <ArrowUpRight aria-hidden />
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
