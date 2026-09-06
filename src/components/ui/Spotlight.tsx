"use client";

import { useCallback, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — a luz acompanha o ponteiro sobre o cartão.
 * A posição vai para variáveis CSS (--mx/--my) e o brilho é desenhado em
 * CSS puro. Nenhum re-render do React durante o movimento do mouse.
 */
export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  const onMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <Tag onPointerMove={onMove} className={cn("spotlight-host", className)}>
      {children}
    </Tag>
  );
}
