"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * SmoothScroll — inércia de scroll com Lenis.
 *
 * Duas decisões conscientes:
 *
 * 1. A biblioteca é importada dinamicamente *depois* de checarmos se ela é
 *    realmente necessária. Em telas de toque o scroll nativo é melhor (e tem
 *    aceleração de hardware), e em `prefers-reduced-motion` inércia é
 *    exatamente o que o usuário pediu para não existir. Nesses casos o Lenis
 *    nunca chega a ser baixado.
 *
 * 2. Todo o trabalho de scroll do site é feito com `useScroll` do Motion, que
 *    já usa o rAF do próprio navegador. Não há ScrollTrigger no projeto —
 *    portanto não há GSAP para sincronizar, e nada de dois laços de animação
 *    disputando frame.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isTouch) return;

    let lenis: Lenis | null = null;
    let cancelled = false;
    let onClick: ((e: MouseEvent) => void) | null = null;

    void (async () => {
      const { default: LenisCtor } = await import("lenis");
      if (cancelled) return;

      lenis = new LenisCtor({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 1,
        autoRaf: true,
      });

      // Links âncora chegam suave ao destino, já compensando o cabeçalho fixo
      onClick = (e: MouseEvent) => {
        const target = (
          e.target as HTMLElement | null
        )?.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!target) return;
        const hash = target.getAttribute("href");
        if (!hash || hash === "#") return;
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        lenis?.scrollTo(el as HTMLElement, { offset: -84, duration: 1.25 });
        history.replaceState(null, "", hash);
      };
      document.addEventListener("click", onClick);
    })();

    return () => {
      cancelled = true;
      if (onClick) document.removeEventListener("click", onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
