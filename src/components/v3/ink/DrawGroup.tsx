"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Intervalo mínimo entre dois replays por hover. */
const REPLAY_GAP_MS = 3000;

/**
 * Dispara o desenho de tudo que está dentro dele.
 *
 * Ao entrar na tela põe `data-drawn` no elemento, e o ink.css faz o resto
 * (traços, notas, peça pronta). O observer se desliga depois do primeiro
 * disparo, então não sobra nada vivo por grupo.
 *
 * Sem IntersectionObserver, com prefers-reduced-motion ou com `?still` na
 * URL, marca na hora. O ink.css já não esconde nada nesses casos, então o
 * atributo só mantém o estado coerente.
 */
export function DrawGroup({
  as = "div",
  className,
  replayOnHover = false,
  children,
}: {
  as?: "div" | "section" | "article" | "figure" | "span";
  className?: string;
  /** Refaz o desenho no mouseenter, no máximo a cada 3s. */
  replayOnHover?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mark = () => el.setAttribute("data-drawn", "");
    const still = window.location.search.includes("still");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (still || reduced || !("IntersectionObserver" in window)) {
      mark();
      return;
    }

    let drawnAt = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        drawnAt = Date.now();
        mark();
        io.disconnect();
      },
      { rootMargin: "0px 0px -15%" },
    );
    io.observe(el);

    const replay = () => {
      // Antes do primeiro desenho não há o que refazer
      if (!drawnAt || Date.now() - drawnAt < REPLAY_GAP_MS) return;
      drawnAt = Date.now();
      el.removeAttribute("data-drawn");
      // Reflow no meio: sem ele o navegador junta as duas mudanças e não reinicia a animação
      void el.offsetWidth;
      mark();
    };
    if (replayOnHover) el.addEventListener("mouseenter", replay);

    return () => {
      io.disconnect();
      el.removeEventListener("mouseenter", replay);
    };
  }, [replayOnHover]);

  // `data-draw` fica no HTML do servidor: é o que o CSS usa para esconder a
  // gravura e os cards até o grupo ser desenhado.
  // O cast só acalma o TypeScript: todas as tags da união aceitam ref e className
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className} data-draw="">
      {children}
    </Tag>
  );
}
