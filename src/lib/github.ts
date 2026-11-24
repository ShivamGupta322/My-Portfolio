import "server-only";
import { cacheLife } from "next/cache";

/**
 * Public GitHub numbers for the "On GitHub" card: repo count from the REST API
 * and the contribution calendar from the public profile graph (the same data
 * as github.com/<user>, no token needed). Cached for an hour and baked into
 * the static page; any failure returns null and the card simply isn't shown.
 * Optional GITHUB_TOKEN raises the REST rate limit.
 */

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubStats {
  username: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  /** Contributions (commits, PRs, issues, reviews) in the last year. */
  contributions: number;
  currentStreak: number;
  longestStreak: number;
  /** Most active single day in the last year. */
  bestDay: number;
  days: ContributionDay[];
}

const UA = "Mozilla/5.0 (compatible; portfolio-site)";

export async function getGitHubStats(username: string): Promise<GitHubStats | null> {
  "use cache";
  cacheLife("hours");

  try {
    const token = process.env.GITHUB_TOKEN?.trim();
    const [userRes, calendarRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          "user-agent": UA,
          accept: "application/vnd.github+json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      }),
      fetch(`https://github.com/users/${username}/contributions`, {
        headers: { "user-agent": UA, accept: "text/html" },
      }),
    ]);
    if (!userRes.ok || !calendarRes.ok) return null;

    const user = (await userRes.json()) as { public_repos?: number; followers?: number };
    const days = parseCalendar(await calendarRes.text());
    if (days.length === 0) return null;

    return {
      username,
      profileUrl: `https://github.com/${username}`,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      contributions: days.reduce((sum, d) => sum + d.count, 0),
      ...streaks(days),
      bestDay: Math.max(...days.map((d) => d.count)),
      days,
    };
  } catch {
    return null;
  }
}

/** Day cells (date, level, id) joined with their tooltips ("3 contributions on …"). */
function parseCalendar(html: string): ContributionDay[] {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = /^([\d,]+) contributions?/.exec(m[2].trim());
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }

  const days: ContributionDay[] = [];
  for (const m of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const tag = m[0];
    const date = /\bdata-date="([^"]+)"/.exec(tag)?.[1];
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    const level = Number(/\bdata-level="(\d)"/.exec(tag)?.[1] ?? 0);
    if (!date) continue;
    days.push({
      date,
      count: (id && counts.get(id)) || 0,
      level: Math.min(4, Math.max(0, level)) as ContributionDay["level"],
    });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function streaks(days: ContributionDay[]) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Current streak: back from the last day; today not counted yet doesn't break it.
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { currentStreak: current, longestStreak: longest };
}
