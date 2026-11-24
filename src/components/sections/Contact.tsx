import { ArrowUpRight, Clock, Download, Mail, MapPin } from "lucide-react";
import { siGithub } from "simple-icons";
import { Reveal } from "@/components/motion/Reveal";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/content/profile";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

/**
 * Contact (docs/MOTION_AND_SHOWCASE.md §5.8): direct channels on the left,
 * glass form (Server Action + Resend, mailto fallback) on the right.
 */
export function Contact({ index }: { index: string }) {
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");
  const github = profile.socials.find((s) => s.label === "GitHub");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-clip border-t border-glass-border section-y defer-render"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] bottom-0 -z-10 size-[560px] rounded-full bg-primary/15 blur-[130px]"
      />
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="contact-title"
            index={index}
            eyebrow="Contact"
            title="Let's build something"
            highlight="build"
            intro="Hiring for a full-stack, mobile or Erlang/OTP role, or have a project in mind? Send a note and I'll reply by email."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal stagger className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-xl p-6 shadow-none glass">
              <p className="flex items-center gap-2 font-mono text-label text-muted uppercase">
                <Mail aria-hidden className="size-3.5 text-primary-text" /> Email
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-display text-[1.125rem] font-semibold break-all text-fg underline-offset-4 hover:underline"
                >
                  {profile.email}
                </a>
                <CopyEmail email={profile.email} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {linkedin && (
                <a
                  href={linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl p-5 shadow-none glass transition-colors hover:border-fg/25"
                >
                  <span>
                    <span className="block font-mono text-label text-muted uppercase">
                      LinkedIn
                    </span>
                    <span className="mt-1.5 block font-semibold">shivam-gupta-sg322</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
              {github && (
                <a
                  href={github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl p-5 shadow-none glass transition-colors hover:border-fg/25"
                >
                  <span>
                    <span className="flex items-center gap-1.5 font-mono text-label text-muted uppercase">
                      <BrandIcon path={siGithub.path} className="size-3" /> GitHub
                    </span>
                    <span className="mt-1.5 block font-semibold">ShivamGupta322</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>

            <div className="rounded-xl p-6 shadow-none glass">
              <p className="flex items-center gap-2 text-fg">
                <MapPin aria-hidden className="size-4 text-primary-text" /> {profile.location}
              </p>
              <p className="mt-2 flex items-center gap-2 text-small text-muted">
                <Clock aria-hidden className="size-4" /> India Standard Time (UTC+5:30)
              </p>
            </div>

            <div className="rounded-xl p-6 shadow-none glass">
              <p className="font-mono text-label text-muted uppercase">Resume</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.values(profile.resume).map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-glass-border bg-glass px-4 text-small font-medium transition-colors hover:border-fg/30 hover:bg-glass-strong"
                  >
                    <Download aria-hidden className="size-3.5 text-primary-text" /> {r.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
