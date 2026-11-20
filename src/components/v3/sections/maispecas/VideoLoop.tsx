"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Vídeo mudo em laço que só toca com o quadro visível.
 *
 * `preload="none"` mantém o vídeo fora do carregamento da página: o
 * navegador só baixa quando o IntersectionObserver manda tocar. Com
 * prefers-reduced-motion ou `?still` o vídeo nunca toca, e o pôster fica
 * como imagem final.
 *
 * A proporção vem do width e height para reservar o espaço antes do
 * primeiro quadro (sem CLS).
 */
export function VideoLoop({
  webm,
  mp4,
  poster,
  width,
  height,
  label,
  className,
}: {
  webm: string;
  mp4: string;
  poster: string;
  width: number;
  height: number;
  /** Descrição para leitor de tela: o vídeo não tem trilha nem controles. */
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (
      window.location.search.includes("still") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    // O atributo `muted` do JSX não chega ao DOM no HTML do servidor, e sem
    // mudo o navegador recusa o play() automático
    video.muted = true;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Promessa rejeitada (arquivo ausente, economia de dados) deixa o pôster
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={cn(
        "block h-auto w-full rounded-[16px] border border-line-dark bg-ink-3",
        className,
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
