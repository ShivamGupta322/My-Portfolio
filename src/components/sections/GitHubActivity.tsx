import { ArrowUpRight } from "lucide-react";
import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { cn } from "@/lib/cn";
import { getGitHubStats, type ContributionDay } from "@/lib/github";

const LEVEL_CLASS: Record<ContributionDay["level"], string> = {
  0: "bg-fg/[0.07]",
  1: "bg-accent/30",
  2: "bg-accent/55",
  3: "bg-accent/80",
  4: "bg-accent",
};

const nf = new Intl.NumberFormat("en-IN");

/**
 * "On GitHub" card: public repos, last-year contributions, streaks and the
 * contribution calendar, drawn in the site's own style. Server component; the
 * numbers come from lib/github.ts (cached hourly). Renders nothing if GitHub
 * couldn't be reached at build/revalidate time.
 */
export async function GitHubActivity({ username }: { username: string }) {
  const stats = await getGitHubStats(username);
  if (!stats) return null;

  // Columns of 7 (Sun → Sat), padded so the first column starts on a Sunday.
  const pad = new Date(`${stats.days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (ContributionDay | null)[] = [...Array<null>(pad).fill(null), ...stats.days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const figures = [
    { value: nf.format(stats.publicRepos), label: "public repositories" },
    { value: nf.format(stats.contributions), label: "contributions in the last year" },
    { value: `${stats.currentStreak}d`, label: "current streak" },
    { value: `${stats.longestStreak}d`, label: "longest streak" },
  ];

  return (
    <div className="glass-gradient rounded-xl p-6 shadow-none glass md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-label text-muted uppercase">
          <BrandIcon path={siGithub.path} className="size-3.5" /> On GitHub
        </p>
        <a
          href={stats.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-small font-medium text-fg/85 transition-colors hover:text-fg"
        >
          @{stats.username}
          <ArrowUpRight
            aria-hidden
            className="size-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label}>
            <dt className="sr-only">{f.label}</dt>
            <dd className="font-mono text-h3 text-gradient tabular-nums">{f.value}</dd>
            <dd className="mt-1 text-[0.8125rem] text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>

      {/* Contribution calendar. Latest week on the right; on narrow screens it
          starts scrolled to the right (row-reverse) so recent activity shows first. */}
      <p className="sr-only">
        {nf.format(stats.contributions)} contributions in the last year; busiest day had{" "}
        {stats.bestDay}.
      </p>
      <div
        aria-hidden
        className="mt-7 flex flex-row-reverse justify-end gap-[3px] overflow-x-auto pb-2 [scrollbar-width:thin] lg:justify-between"
      >
        {[...weeks].reverse().map((week, w) => (
          <div key={w} className="flex shrink-0 flex-col gap-[3px]">
            {week.map((d, i) =>
              d ? (
                <span
                  key={d.date}
                  title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                  className={cn("size-[11px] rounded-[3px]", LEVEL_CLASS[d.level])}
                />
              ) : (
                <span key={`pad-${i}`} className="size-[11px]" />
              ),
            )}
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[0.6875rem] text-muted"
      >
        Less
        {([0, 1, 2, 3, 4] as const).map((l) => (
          <span key={l} className={cn("size-[11px] rounded-[3px]", LEVEL_CLASS[l])} />
        ))}
        More
      </div>
    </div>
  );
}
