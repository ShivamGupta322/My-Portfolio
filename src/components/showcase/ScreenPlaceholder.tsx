import { cn } from "@/lib/cn";

/**
 * Branded "UI preview" shown inside mockups until real screenshots exist
 * (add them under media.phoneScreens / media.desktopFull). Built from the
 * project's own highlights so each step still says something true; tagged
 * "UI preview" so it never passes for a real screenshot.
 */

export function PreviewTag() {
  return (
    <span className="absolute right-2 bottom-2 z-10 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.12em] text-white/80 uppercase">
      UI preview
    </span>
  );
}

function Bar({ w, className }: { w: string; className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-fg/10", className)} style={{ width: w }} />;
}

export function PhoneScreenPlaceholder({
  title,
  heading,
  body,
  step,
  accent,
  tag = true,
}: {
  title: string;
  heading: string;
  body: string;
  step: number;
  accent: string;
  /** Set false when the surrounding card already shows a "UI preview" tag. */
  tag?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-surface text-fg">
      {/* status bar */}
      <div className="flex items-center justify-between px-[8%] pt-[4.5%] font-mono text-[0.5625rem] text-muted">
        <span>9:41</span>
        <span className="flex gap-1">
          <span className="h-1.5 w-3 rounded-sm bg-fg/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-fg/40" />
        </span>
      </div>
      {/* app bar */}
      <div className="mt-[9%] flex items-center gap-2 px-[7%]">
        <span
          className="grid size-7 place-items-center rounded-lg font-display text-[0.75rem] font-bold text-[#07070c]"
          style={{ background: accent }}
        >
          {title[0]}
        </span>
        <span className="font-display text-[0.8125rem] font-semibold">{title}</span>
      </div>
      {/* hero card */}
      <div className="mx-[7%] mt-[7%] rounded-xl border border-glass-border bg-elevated p-3">
        <span
          className="font-mono text-[0.5625rem] tracking-[0.14em] uppercase"
          style={{ color: accent }}
        >
          {String(step + 1).padStart(2, "0")}
        </span>
        <p className="mt-1 font-display text-[0.8125rem] leading-snug font-semibold">{heading}</p>
        <p className="mt-1.5 line-clamp-4 text-[0.625rem] leading-relaxed text-muted">{body}</p>
        <span
          className="mt-3 block h-1 w-1/3 rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      </div>
      {/* list rows */}
      <div className="mt-[7%] flex flex-col gap-3 px-[7%]">
        {[70, 52, 64].map((w, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="size-6 shrink-0 rounded-full bg-fg/10" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Bar w={`${w}%`} />
              <Bar w={`${w - 25}%`} className="h-1.5 bg-fg/5" />
            </div>
          </div>
        ))}
      </div>
      {/* tab bar */}
      <div className="mt-auto flex justify-around border-t border-glass-border px-[7%] pt-3 pb-[7%]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="size-4 rounded-md"
            style={{
              background:
                i === step % 4 ? accent : "color-mix(in srgb, var(--c-fg) 12%, transparent)",
            }}
          />
        ))}
      </div>
      {tag && <PreviewTag />}
    </div>
  );
}

/**
 * One "page" per highlight, stacked in a flex column whose height the parent
 * sets to N × viewport; the parent translates to the active page. Render
 * <PreviewTag /> outside the moving column.
 */
export function DesktopPagesPlaceholder({
  title,
  sections,
  accent,
}: {
  title: string;
  sections: readonly { title: string; body: string }[];
  accent: string;
}) {
  return (
    <>
      {sections.map((s, i) => (
        <div key={i} className="flex min-h-0 flex-1 flex-col bg-surface px-[5%] pt-[3.5%] text-fg">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="size-4 rounded-md" style={{ background: accent }} />
              <span className="font-display text-[0.75rem] font-semibold">{title}</span>
            </span>
            <span className="flex gap-3">
              <Bar w="34px" />
              <Bar w="28px" />
              <Bar w="40px" />
            </span>
          </div>
          <div className="mt-[6%] grid flex-1 grid-cols-[1.1fr_1fr] gap-[5%]">
            <div>
              <span
                className="font-mono text-[0.5625rem] tracking-[0.14em] uppercase"
                style={{ color: accent }}
              >
                {String(i + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
              </span>
              <p className="mt-2 font-display text-[clamp(0.875rem,1.6vw,1.375rem)] leading-tight font-bold">
                {s.title}
              </p>
              <p className="mt-2 line-clamp-3 text-[0.625rem] leading-relaxed text-muted">
                {s.body}
              </p>
              <span
                className="mt-4 inline-block h-5 w-20 rounded-full"
                style={{ background: accent, opacity: 0.85 }}
              />
            </div>
            <div className="relative overflow-hidden rounded-lg border border-glass-border bg-elevated">
              <span
                className="absolute inset-0 opacity-40"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${accent}, transparent 65%)`,
                }}
              />
              <div className="absolute inset-x-[8%] bottom-[10%] flex flex-col gap-1.5">
                <Bar w="80%" />
                <Bar w="55%" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
