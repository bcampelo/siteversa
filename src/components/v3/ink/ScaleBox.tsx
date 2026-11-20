"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Palco desenhado em pixels fixos (`w` por `h`) que escala para a largura do
 * contêiner. Serve para peças com muitos itens posicionados em pixel, que
 * não sobrevivem a um layout fluido no celular.
 *
 * A altura é reservada pelo `aspect-ratio` do invólucro, então a escala não
 * causa CLS. O `--s` é medido por ResizeObserver; antes dele (primeira
 * pintura, ainda sem hidratar) o CSS calcula o mesmo valor sozinho com
 * `tan(atan2(100cqw, w))`, que divide dois comprimentos e devolve um número.
 */
export function ScaleBox({
  w,
  h,
  className,
  children,
}: {
  w: number;
  h: number;
  className?: string;
  children: ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const apply = () => el.style.setProperty("--s", String(el.clientWidth / w));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  const outerStyle: CSSProperties = {
    aspectRatio: `${w} / ${h}`,
    containerType: "inline-size",
  };
  const innerStyle: CSSProperties = {
    width: w,
    height: h,
    transformOrigin: "0 0",
    transform: `scale(var(--s, tan(atan2(100cqw, ${w}px))))`,
  };

  return (
    <div
      ref={outer}
      className={cn("relative w-full overflow-clip", className)}
      style={outerStyle}
    >
      <div className="absolute left-0 top-0" style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
