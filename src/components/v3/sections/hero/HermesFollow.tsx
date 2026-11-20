"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Deslocamento máximo do Hermes, em px, quando o mouse vai de um canto a outro do hero. */
const SHIFT_X = -14;
const SHIFT_Y = -10;

/**
 * Faz o Hermes (gravura e ondas do megafone) andar no sentido contrário ao
 * do mouse dentro do hero.
 *
 * Só monta o seguidor com mouse de verdade (`pointer: fine`), sem
 * prefers-reduced-motion e sem `?still`: nos outros casos o Hermes fica
 * parado, que é o estado final. O deslocamento vai na propriedade
 * individual `translate`, então não briga com nenhum `transform`. Um
 * listener passivo só guarda o alvo, e um único requestAnimationFrame por
 * quadro escreve o valor; a suavidade vem da transição do CSS.
 */
export function HermesFollow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest<HTMLElement>("#hero");
    if (!el || !host) return;

    const still = window.location.search.includes("still");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (still || reduced || !fine) return;

    let x = 0;
    let y = 0;
    let frame = 0;

    const apply = () => {
      frame = 0;
      el.style.translate = `${x}px ${y}px`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      // dx e dy vão de -.5 (canto esquerdo/de cima) a .5 (direito/de baixo)
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      x = Math.round(dx * SHIFT_X * 10) / 10;
      y = Math.round(dy * SHIFT_Y * 10) / 10;
      schedule();
    };
    const leave = () => {
      x = 0;
      y = 0;
      schedule();
    };

    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
      el.style.translate = "";
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "[transition:translate_.6s_cubic-bezier(.2,.8,.2,1)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
