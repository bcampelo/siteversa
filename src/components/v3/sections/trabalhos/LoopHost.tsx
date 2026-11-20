"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Casca do palco da Arasuper: guarda só o estado do botão Pausar.
 *
 * Quem de fato pausa o laço é o ink.css (`.loop-host[data-paused="true"]`,
 * mais hover e foco). As colunas chegam como `children` já renderizadas no
 * servidor, então este componente não carrega conteúdo nenhum.
 *
 * Pausar não gera evento de medição (seção 4.6).
 */
export function LoopHost({
  className,
  pauseLabel,
  resumeLabel,
  children,
}: {
  className?: string;
  pauseLabel: string;
  resumeLabel: string;
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={cn("loop-host", className)} data-paused={paused}>
      {children}
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className="absolute right-4 bottom-4 z-10 h-9 cursor-pointer rounded-full border border-line-dark bg-ink px-4 text-[13px] text-chalk [transition-property:scale,border-color] [transition-duration:.12s,.22s] hover:border-fog active:scale-[0.97]"
      >
        {paused ? resumeLabel : pauseLabel}
      </button>
    </div>
  );
}
