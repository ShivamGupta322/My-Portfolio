import Link from "next/link";
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-sans font-semibold whitespace-nowrap",
    "transition-[background-color,border-color,box-shadow,color] duration-200 ease-out-quart",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.125em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary-strong text-white hover:bg-primary-strong-hover hover:shadow-glow",
        glass: "text-fg shadow-none glass hover:border-fg/20 hover:bg-glass-strong",
        ghost: "text-fg hover:bg-glass",
        link: "h-auto px-0 text-primary-text underline-offset-4 hover:underline",
      },
      size: {
        md: "h-11 px-5 text-small",
        lg: "h-12 px-6 text-body",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & Variants) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

/** Internal routes use next/link; external URLs open in a new tab. */
export function ButtonLink({
  className,
  variant,
  size,
  href,
  external,
  ...props
}: Omit<ComponentProps<"a">, "href"> & Variants & { href: string; external?: boolean }) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props} />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
