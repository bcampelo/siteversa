import Image from "next/image";
import {
  Burst,
  Hand,
  Pen,
  ScaleBox,
  cssVars,
} from "@/components/v3/ink";
import { SOBRE } from "@/lib/content-v3";

/** Palco do retrato, em pixels de desenho. Escala por ScaleBox abaixo de 1101px. */
const PALCO_W = 560;
const PALCO_H = 760;

/** Mesma máscara da 4.2: apaga ombros e base da foto, o resto fica opaco. */
const FOTO_MASK =
  "radial-gradient(56% 60% at 52% 32%, var(--color-ink) 62%, transparent 100%)";

/** Atraso de entrada das linhas do texto, em segundos. */
const settle = (delay: number) => cssVars({ "--d": `${delay}s` });

/**
 * Abertura do /sobre: texto à esquerda, retrato do Breno à direita.
 *
 * Como o Hero da home, nasce desenhado (`data-drawn` no HTML do servidor):
 * é a primeira dobra, não pode esperar a hidratação para começar.
 * A foto é natural, sem gravura nem filtro. O estilo da marca está só nos
 * traços em volta.
 */
export function SobreHero() {
  return (
    <section className="relative overflow-clip">
      <div
        data-draw=""
        data-drawn=""
        className="relative max-tab:flex max-tab:flex-col tab:min-h-[720px] desk:min-h-[860px]"
      >
        {/* Palco 560x760. Mobile: antes do texto, até 380px. Tablet: 440px. Desktop: 560px, passando um pouco do container */}
        <div
          className="max-tab:order-first max-tab:mx-auto max-tab:mt-24 max-tab:w-[min(380px,calc(100%-48px))] tab:absolute tab:top-24 tab:right-2.5 tab:w-[440px] desk:right-[max(0px,calc(50%-660px))] desk:w-[560px]"
        >
          <ScaleBox w={PALCO_W} h={PALCO_H} className="overflow-visible!">
            <div className="relative" style={{ width: PALCO_W, height: PALCO_H }}>
              <Burst
                viewBox="0 0 440 600"
                cx={220}
                cy={250}
                r={180}
                n={72}
                min={18}
                max={116}
                // Semente própria do /sobre: nenhum outro Burst do site usa 41
                seed={41}
                ring
                opacity={0.45}
                delay={0.2}
                dur={2.2}
                style={{ inset: 0, width: "100%", height: "100%" }}
              />

              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${PALCO_W} ${PALCO_H}`}
                aria-hidden="true"
              >
                <Pen d="M78 330 A 210 210 0 0 1 470 190" thin delay={0.5} dur={1.2} />
                <Pen d="M488 230 A 210 210 0 0 1 496 330" thin tone="fog" delay={1.1} />
                <Pen d="M268 32 H 292 M280 20 V 44" thin tone="fog" delay={1.3} />
              </svg>

              {/* Foto natural. unoptimized: o WebP já sai pronto do script, com alfa em qualidade 100, e o otimizador recomprimiria as bordas */}
              <Image
                src="/v3/breno.webp"
                alt={SOBRE.portraitAlt}
                width={920}
                height={1247}
                priority
                unoptimized
                draggable={false}
                className="sb-photo pointer-events-none absolute bottom-[-10px] left-1/2 ml-[-262px] h-auto w-[460px] max-w-none"
                style={{ maskImage: FOTO_MASK, WebkitMaskImage: FOTO_MASK }}
              />

              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${PALCO_W} ${PALCO_H}`}
                aria-hidden="true"
              >
                <Pen
                  d="M30 130 C 70 120, 120 150, 170 210 M170 210 L 167 196 M170 210 L 157 205"
                  delay={1.6}
                />
                <Pen
                  d="M40 600 C 80 590, 110 570, 140 540 M140 540 L 136 527 M140 540 L 127 536"
                  delay={2}
                />
              </svg>

              {/* Abaixo de 1280px as notas ficam dentro do palco: fora dele cobririam o título */}
              <Hand
                as="p"
                delay={1.4}
                rotate={-4}
                className="absolute top-[96px] left-2.5 text-[26px] whitespace-nowrap min-[1280px]:left-[-140px]"
              >
                {SOBRE.notes.who}
              </Hand>
              <Hand
                as="p"
                delay={1.8}
                rotate={-3}
                className="absolute top-[600px] left-2.5 text-[26px] whitespace-nowrap min-[1280px]:left-[-190px]"
              >
                {SOBRE.notes.both[0]}
                <br />
                {SOBRE.notes.both[1]}
              </Hand>
            </div>
          </ScaleBox>
        </div>

        <div className="wrap relative z-[2] pt-8 pb-16 tab:pt-[200px] tab:pb-0 desk:pt-[240px]">
          {/* Só a citação gira; a legenda fica reta, como na referência */}
          <Hand as="p" delay={0.2} rotate={-2} className="origin-left text-[34px]">
            {SOBRE.quote.latin}
          </Hand>
          <p className="mt-1 text-[14px] text-fog">{SOBRE.quote.translation}</p>

          <h1 className="mt-6 font-display text-[64px] leading-[0.92] font-medium tracking-[-0.05em] [overflow-wrap:break-word] tab:text-[88px] desk:text-[112px]">
            <span className="settle block" style={settle(0.1)}>
              {SOBRE.title[0]}
            </span>
            <span className="settle block" style={settle(0.18)}>
              {SOBRE.title[1]}
            </span>
          </h1>

          <p className="settle mt-6 text-[22px] text-fog" style={settle(0.3)}>
            {SOBRE.role}
          </p>
        </div>
      </div>
    </section>
  );
}
