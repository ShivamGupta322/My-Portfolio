"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProjectStage } from "@/components/showcase/ProjectStage";
import { useLens } from "@/hooks/useLens";
import { ScrollTrigger } from "@/lib/gsap";
import type { DiagramView, ProjectView } from "@/lib/projectView";
import type { Lens } from "@/types/content";

/**
 * Featured stages for the active lens. Switching lens crossfades to the other
 * lens's set (different projects, different order), then refreshes every
 * ScrollTrigger because the page height changed.
 */
export function FeaturedProjects({
  featured,
  diagrams,
}: {
  featured: Record<Lens, ProjectView[]>;
  diagrams: Record<string, DiagramView>;
}) {
  const lens = useLens();
  const list = featured[lens];

  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [lens]);

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
      <motion.div
        key={lens}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {list.map((project, i) => (
          <ProjectStage
            key={project.slug}
            project={project}
            index={i}
            diagram={project.architecture ? diagrams[project.architecture] : undefined}
            defaultUnderHood={lens === "systems"}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
