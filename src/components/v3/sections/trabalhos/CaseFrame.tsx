import type { ReactNode } from "react";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { DrawGroup, ScaleBox } from "@/components/v3/ink";
import { LoopHost } from "./LoopHost";

/** Palco desenhado do desktop: a referência mede 1120x600. */
export const STAGE_W = 1120;
export const STAGE_H = 600;

const BOX =
  "relative overflow-hidden rounded-[24px] border border-line-dark bg-ink-3";

/**
 * Moldura de um case: palco com a estátua e as peças do cliente, e a legenda.
 *
 * Do tablet para cima o palco é o desenho de 1120x600 escalado (`desk`). No
 * celular as peças saem da estátua e viram uma coluna (`mobile`). As duas
 * versões ficam no mesmo DrawGroup, e a que não cabe no breakpoint tem
 * display:none, então só uma é lida e pintada.
 *
 * O palco é uma imagem para leitor de tela (role="img"). O botão Pausar
 * fica fora dele de propósito: filho de role="img" é apresentacional e o
 * botão sumiria da navegação por teclado assistida.
 */
export function CaseFrame({
  label,
  desk,
  mobile,
  name,
  description,
  link,
  pause,
}: {
  label: string;
  desk: ReactNode;
  mobile: ReactNode;
  name: string;
  description: string;
  /** Só renderiza se houver URL confirmada. */
  link?: { href: string; label: string };
  /** Com isto o palco ganha o botão Pausar e o laço da Arasuper. */
  pause?: { pause: string; resume: string };
}) {
  const stage = (
    <div role="img" aria-label={label}>
      <div className="max-tab:hidden">
        <ScaleBox w={STAGE_W} h={STAGE_H}>
          {desk}
        </ScaleBox>
      </div>
      <div className="tab:hidden">{mobile}</div>
    </div>
  );

  return (
    <DrawGroup as="figure" className="mb-12 min-w-0 tab:mb-16">
      {pause ? (
        <LoopHost
          className={BOX}
          pauseLabel={pause.pause}
          resumeLabel={pause.resume}
        >
          {stage}
        </LoopHost>
      ) : (
        <div className={BOX}>{stage}</div>
      )}
      <figcaption className="flex flex-col gap-1 pt-4 tab:flex-row tab:items-baseline tab:justify-between tab:gap-6">
        <div className="min-w-0">
          <strong className="block font-display text-[28px] leading-[1.55] font-medium tracking-[-0.02em] tab:inline">
            {name}
          </strong>
          <span className="block text-fog tab:ml-4 tab:inline">
            {description}
          </span>
        </div>
        {link && (
          <TrackedLink
            href={link.href}
            section="trabalhos"
            event="case_open"
            ctaLabel={link.label}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] underline decoration-accent underline-offset-4"
          >
            {link.label}
          </TrackedLink>
        )}
      </figcaption>
    </DrawGroup>
  );
}
