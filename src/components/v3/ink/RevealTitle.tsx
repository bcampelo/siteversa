"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Título de seção que se revela ao entrar na tela (clip-path + translateY,
 * regras `.reveal` no ink.css).
 *
 * Tem o próprio observer, em vez de depender do `data-drawn` de um
 * <DrawGroup> pai: assim funciona em qualquer lugar da página e não amarra o
 * título ao tempo dos traços. Marca `data-in` uma vez e se desliga.
 *
 * O CSS só esconde o título com JS ativo, sem `?still` e com movimento
 * permitido. Sem isso o título é texto comum, no estado final.
 */
export function RevealTitle({
  as: Tag = "h2",
  className,
  children,
}: {
  as?: "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mark = () => el.setAttribute("data-in", "");
    const still = window.location.search.includes("still");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || reduced || !("IntersectionObserver" in window)) {
      mark();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        mark();
        io.disconnect();
      },
      { rootMargin: "0px 0px -10%" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
