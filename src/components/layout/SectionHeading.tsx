import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center gap-3 text-eyebrow", className)}>
      {index && <span className="text-brand-soft/70">{index}</span>}
      <span aria-hidden className="h-px w-8 bg-chalk/20" />
      <span className="text-fog">{children}</span>
    </p>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal y={16} blur={false}>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "text-display max-w-[22ch] text-balance",
            align === "center" && "mx-auto",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "text-lede max-w-[52ch] text-fog",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
