import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

/** Public site shell: preloader, progress bar, floating nav, footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <noscript>
        <style>{`.preloader{display:none}`}</style>
      </noscript>
      <Preloader />
      <ScrollProgress />
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
