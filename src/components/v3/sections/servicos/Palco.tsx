import type { ReactNode } from "react";
import { DrawGroup, ScaleBox } from "@/components/v3/ink";

/** Tamanho desenhado dos três palcos; a referência mede 616x380 no desktop. */
export const PALCO_W = 616;
export const PALCO_H = 380;

/**
 * Moldura comum dos palcos de serviço: rascunho que vira peça pronta.
 * O DrawGroup envolve só o palco (não a linha inteira) para o desenho
 * começar quando o palco aparece, mesmo com o texto empilhado em cima no celular.
 *
 * O palco inteiro é uma imagem para leitor de tela: as peças ilustrativas
 * dentro dele não são links nem controles.
 */
export function Palco({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    // Refaz sozinho a cada 7s enquanto o palco está na tela; o hover continua valendo
    <DrawGroup replayOnHover replayEvery={7000} className="min-w-0">
      <div role="img" aria-label={label}>
        <ScaleBox
          w={PALCO_W}
          h={PALCO_H}
          // A borda é sombra interna para não encolher a área escalada em 2px
          className="rounded-[20px] bg-ink-3 shadow-[inset_0_0_0_1px_var(--color-line-dark)]"
        >
          {children}
        </ScaleBox>
      </div>
    </DrawGroup>
  );
}

/** Camada de SVG que cobre o palco inteiro (rascunho ou seta). */
export const camada = "absolute inset-0 h-full w-full";
export const viewBox = `0 0 ${PALCO_W} ${PALCO_H}`;
