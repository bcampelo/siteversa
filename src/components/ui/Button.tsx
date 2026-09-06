import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "quiet";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-tight transition-[transform,box-shadow,background-color,border-color] duration-500 ease-versa will-change-transform active:scale-[0.985]";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.35rem] px-7 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-chalk text-ink shadow-[0_10px_40px_-12px_rgba(201,186,255,0.55)] hover:shadow-[0_16px_50px_-10px_rgba(139,92,240,0.65)]",
  ghost:
    "border border-chalk/15 bg-chalk/[0.03] text-chalk backdrop-blur-md hover:border-brand-soft/45 hover:bg-chalk/[0.07]",
  quiet: "text-fog hover:text-chalk",
};

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      {/* brilho que atravessa o botão no hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-versa group-hover/btn:translate-x-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {children}
      </span>
    </>
  );
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
} & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children" | "ref"
>) {
  const cls = cn(base, sizes[size], variants[variant], className);

  if (external || href.startsWith("http") || href.startsWith("mailto")) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className={cls}
        {...rest}
      >
        <Inner>{children}</Inner>
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      <Inner>{children}</Inner>
    </Link>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn(
        "size-[1.05em] transition-transform duration-500 ease-versa group-hover/btn:translate-x-1",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-[1.15em]", className)}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.04-.19-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.23-8.23 2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.4-.12-.56.13-.17.25-.66.81-.81.97-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.3.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}
