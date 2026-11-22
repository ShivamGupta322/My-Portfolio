import { cn } from "@/lib/cn";

/**
 * Eyebrow ("01 / EXPERIENCE") + h2 with one gradient-highlighted word.
 * `highlight` must be a substring of `title`.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
  intro,
  as: Tag = "h2",
  id,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: string;
  as?: "h1" | "h2";
  /** id for the heading element (target of a section's aria-labelledby) */
  id?: string;
  className?: string;
}) {
  const parts = highlight ? title.split(highlight) : [title];
  return (
    <header className={cn("max-w-3xl", className)}>
      <p className="mb-4 font-mono text-label text-muted uppercase">
        {index && <span className="text-primary-text">{index} / </span>}
        {eyebrow}
      </p>
      <Tag id={id} className={Tag === "h1" ? "text-h1" : "text-h2"}>
        {highlight && parts.length > 1 ? (
          <>
            {parts[0]}
            <span className="text-gradient">{highlight}</span>
            {parts.slice(1).join(highlight)}
          </>
        ) : (
          title
        )}
      </Tag>
      {intro && <p className="mt-6 max-w-[70ch] text-lead text-muted">{intro}</p>}
    </header>
  );
}
