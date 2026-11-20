import Image from "next/image";
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
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      draggable={false}
      className={cn("eg", className)}
    />
  );
}
