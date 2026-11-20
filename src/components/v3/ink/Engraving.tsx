import Image from "next/image";
import { preload } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Gravura pronta, assada no build por scripts/gravuras.mjs com alfa. Em
 * produção não há filter, mix-blend-mode nem máscara CSS: é só imagem.
 *
 * `unoptimized` de propósito: o arquivo já é WebP gerado por nós, a 2x do
 * tamanho de exibição. Passar de novo pelo otimizador do Next recomprimiria
 * as listras de 5px e borraria o traço.
 *
 * A entrada (`egin`) é do ink.css e dispara quando o <DrawGroup> pai ganha
 * `data-drawn`. Posição e tamanho de exibição vêm do `className`.
 */
export function Engraving({
  src,
  alt,
  width,
  height,
  className,
  priority,
  enter = true,
  mobileSrc,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  /**
   * Com `false` a gravura aparece na primeira pintura, sem `egin`. É o caso
   * do Hermes do hero: candidato a LCP, não pode esperar hidratação.
   */
  enter?: boolean;
  /**
   * Variante menor para telas de até 760px (ex.: "/v3/hermes-m.webp"). Com
   * ela o componente renderiza um <picture>; o `src` continua sendo o
   * <img>, com width, height, alt, fetchPriority e classes de sempre.
   */
  mobileSrc?: string;
}) {
  // Com `unoptimized` o next/image não emite o preload do `priority`, e ele
  // nunca põe fetchPriority sozinho. Sem os dois, o Hermes do hero (LCP) cai
  // atrás do JS e das fontes na fila do navegador. preload() do react-dom
  // funciona em componente de servidor e escreve o <link> no <head>. Com
  // variante de celular cada preload leva a sua mídia, senão o celular
  // baixaria as duas.
  if (priority) {
    if (mobileSrc) {
      preload(mobileSrc, {
        as: "image",
        fetchPriority: "high",
        media: "(max-width: 760px)",
      });
      preload(src, {
        as: "image",
        fetchPriority: "high",
        media: "(min-width: 761px)",
      });
    } else {
      preload(src, { as: "image", fetchPriority: "high" });
    }
  }

  const img = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      unoptimized
      draggable={false}
      className={cn("eg", !enter && "eg-now", className)}
    />
  );

  if (!mobileSrc) return img;

  // `contents`: o <picture> não vira caixa, o <img> posiciona como antes
  return (
    <picture className="contents">
      <source media="(max-width: 760px)" srcSet={mobileSrc} />
      {img}
    </picture>
  );
}
