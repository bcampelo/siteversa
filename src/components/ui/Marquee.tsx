import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marquee em CSS puro (duas cópias + translate de -50%).
 * Sem JS, sem rAF: roda no compositor e não custa nada em runtime.
 */
export function Marquee({
  children,
  reverse = false,
  speed = 44,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  reverse?: boolean;
  /** Duração de um ciclo completo, em segundos. */
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("mask-edges group/marquee overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        <div aria-hidden={false} className="flex shrink-0">
          {children}
        </div>
        <div aria-hidden className="flex shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}
