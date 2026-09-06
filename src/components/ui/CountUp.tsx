"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * CountUp — número que sobe até o valor final ao entrar na tela.
 *
 * O valor inicial renderizado é sempre `0`, inclusive em
 * `prefers-reduced-motion`. Isso é deliberado: se o texto do servidor e do
 * cliente divergissem, o React descartaria a árvore hidratada. Quem pediu
 * menos movimento recebe o número final num único passo, via efeito.
 */
export function CountUp({
  to,
  duration = 1900,
  className,
}: {
  to: number;
  /** Duração em milissegundos. */
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Quem pediu menos movimento recebe o valor final no primeiro frame.
    const span = reduce ? 0 : duration;
    let raf = 0;
    const start = performance.now();
    // easeOutQuint — mesma desaceleração das outras animações do site
    const ease = (t: number) => 1 - Math.pow(1 - t, 5);

    const tick = (now: number) => {
      const t = span === 0 ? 1 : Math.min(1, (now - start) / span);
      setValue(Math.round(ease(t) * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
