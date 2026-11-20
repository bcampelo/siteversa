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
  replayEvery,
  children,
}: {
  as?: "div" | "section" | "article" | "figure" | "span";
  className?: string;
  /** Refaz o desenho no mouseenter, no máximo a cada 3s. */
  replayOnHover?: boolean;
  /**
   * Refaz o desenho sozinho a cada `replayEvery` ms, enquanto metade do grupo
   * está na tela e a aba está ativa. Um replay recente, de qualquer origem
   * (hover incluído), adia o próximo: se o último desenho tem menos da metade
   * de `replayEvery`, o disparo é pulado e reagendado a partir dele.
   */
  replayEvery?: number;
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

    // Replay automático. Um setTimeout encadeado em vez de setInterval: o
    // próximo disparo conta a partir do último desenho, inclusive o do hover.
    let timer = 0;
    let half: IntersectionObserver | undefined;
    let stopVisibility: (() => void) | undefined;
    if (replayEvery) {
      let visible = false;
      const schedule = () => {
        window.clearTimeout(timer);
        // Aba oculta: não reagenda. O visibilitychange acorda de novo ao voltar.
        if (!visible || document.hidden) return;
        const wait = drawnAt ? Math.max(drawnAt + replayEvery - Date.now(), 500) : replayEvery;
        timer = window.setTimeout(tick, wait);
      };
      const tick = () => {
        if (drawnAt && Date.now() - drawnAt >= replayEvery / 2) replay();
        schedule();
      };
      half = new IntersectionObserver(
        (entries) => {
          visible = entries[entries.length - 1].isIntersecting;
          schedule();
        },
        { threshold: 0.5 },
      );
      half.observe(el);
      document.addEventListener("visibilitychange", schedule);
      stopVisibility = () => document.removeEventListener("visibilitychange", schedule);
    }

    return () => {
      io.disconnect();
      half?.disconnect();
      stopVisibility?.();
      window.clearTimeout(timer);
      el.removeEventListener("mouseenter", replay);
    };
  }, [replayOnHover, replayEvery]);

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
