import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Global MDX element styles (required by @next/mdx in the App Router).
 * Case studies read like a long-form article: 70ch measure, display headings,
 * mono for code, gradient hairline for rules.
 */
const components: MDXComponents = {
  h2: (props: ComponentProps<"h2">) => <h2 className="mt-14 mb-4 text-h3" {...props} />,
  h3: (props: ComponentProps<"h3">) => <h3 className="mt-10 mb-3 text-h4" {...props} />,
  p: (props: ComponentProps<"p">) => (
    <p className="my-5 text-muted [&_strong]:text-fg" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="my-5 list-disc space-y-2 pl-5 text-muted marker:text-primary-text" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      className="my-5 list-decimal space-y-2 pl-5 text-muted marker:font-mono marker:text-primary-text"
      {...props}
    />
  ),
  li: (props: ComponentProps<"li">) => <li className="pl-1 [&_strong]:text-fg" {...props} />,
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a
      className={cn(
        "text-primary-text underline decoration-primary/40 underline-offset-4 hover:decoration-primary",
        className,
      )}
      {...(props.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-semibold text-fg" {...props} />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      className="rounded-sm border border-glass-border bg-elevated px-1.5 py-0.5 font-mono text-[0.875em] text-accent"
      {...props}
    />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-md border border-glass-border bg-[#0b0b12] p-5 font-mono text-small leading-relaxed text-white/90 [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote className="my-6 border-l-2 border-primary pl-5 text-lead text-fg/90" {...props} />
  ),
  hr: () => (
    <hr className="my-12 h-px border-0 bg-linear-to-r from-primary/60 via-accent/30 to-transparent" />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
