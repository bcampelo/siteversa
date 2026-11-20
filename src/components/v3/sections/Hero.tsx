import { Button } from "@/components/ui/Button";
import {
  Burst,
  Engraving,
  Hand,
  Pen,
  ScaleBox,
  cssVars,
} from "@/components/v3/ink";
import { CTA_LABEL, HERO } from "@/lib/content-v3";
import { whatsappUrl } from "@/lib/whatsapp";
import { HermesFollow } from "./hero/HermesFollow";

/**
 * Raios que saem do megafone do Hermes (viewBox 0 0 600 740). A geometria é
 * da referência e não vem do <Burst> porque o leque é desenhado à mão, não
 * radial. Cada traço entra 0.03s depois do anterior, a partir de 0.8s.
 */
const ONDAS = [
  "M591 307 L750 31",
  "M593 309 L725 119",
  "M595 310 L824 37",
  "M596 312 L722 186",
  "M598 313 L744 191",
  "M599 315 L950 70",
  "M601 317 L775 216",
  "M602 319 L911 175",
  "M602 321 L774 259",
  "M603 323 L1002 216",
  "M604 325 L863 280",
  "M604 328 L776 313",
  "M604 330 L802 330",
  "M604 332 L978 365",
  "M604 335 L966 398",
  "M603 337 L786 386",
  "M602 339 L863 434",
  "M602 341 L783 426",
  "M601 343 L922 528",
  "M599 345 L750 450",
  "M598 347 L764 486",
  "M596 348 L786 538",
  "M595 350 L714 492",
  "M593 351 L798 644",
  "M591 353 L680 508",
] as const;

/* Mesma máscara do halo da referência: os raios somem antes da borda do palco */
const HALO_MASK =
  "radial-gradient(circle at 50% 40%, var(--color-ink) 42%, transparent 66%)";

/** Atraso de entrada da linha de título, em segundos (--d da referência). */
const settle = (delay: number) => cssVars({ "--d": `${delay}s` });

export function Hero() {
  return (
    // O id fica na seção porque o StickyCta observa #hero
    <section id="hero" className="relative overflow-clip">
      {/* A referência nasce desenhada: data-drawn no HTML do servidor começa o desenho na primeira pintura, sem esperar hidratar */}
      <div data-draw="" data-drawn="" className="relative tab:min-h-[800px]">
        <div className="wrap relative z-[2] pt-[120px] tab:pt-[200px] desk:pt-[232px]">
          <h1 className="max-w-[13ch] font-display text-[46px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] max-tab:min-w-0 tab:text-[64px] tab:leading-[0.98] desk:text-[80px]">
            <span className="settle block" style={settle(0.1)}>
              {HERO.lines[0]}
            </span>
            <span className="settle block" style={settle(0.16)}>
              {HERO.lines[1]}
            </span>
            <span className="settle block" style={settle(0.22)}>
              {HERO.lastLine.before}
              <span className="relative inline-block">
                {HERO.lastLine.circled}
                {/* Círculo à mão: a assinatura do hero, aparece uma vez */}
                <svg
                  className="pointer-events-none absolute top-[-12%] left-[-7%] h-[128%] w-[114%] overflow-visible"
                  viewBox="0 0 200 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <Pen
                    d="M18 58 C 10 20, 180 6, 190 46 C 198 84, 40 98, 14 66 C 6 54, 30 30, 70 24"
                    delay={0.9}
                    dur={0.8}
                    width={3}
                  />
                </svg>
              </span>
              {HERO.lastLine.after}
            </span>
          </h1>

          <Hand
            delay={1.5}
            className="mt-4 block origin-left text-[24px]"
          >
            {HERO.cite}
          </Hand>

          <p
            // No tablet o Hermes sobreposto cobre o resto da linha; 270px deixa o lede inteiro ao lado do peito
            className="settle mt-6 mb-10 max-w-[34ch] text-[20px] text-fog tab:max-w-[270px] min-[1000px]:max-w-[34ch]"
            style={settle(0.3)}
          >
            {HERO.lede}
          </p>

          <div className="settle flex items-center gap-6" style={settle(0.4)}>
            <Button
              href={whatsappUrl("hero")}
              external
              section="hero"
              ctaLabel={CTA_LABEL}
            >
              {HERO.cta}
            </Button>
            {/* Abaixo de 1101px só o botão: no tablet o Hermes sobreposto cobre a nota, no celular ela não cabe ao lado */}
            <span className="hand flex items-center gap-2 text-[26px] max-desk:hidden">
              <svg width="54" height="30" viewBox="0 0 54 30" aria-hidden="true">
                <Pen
                  d="M52 8 C 36 2, 18 6, 6 20 M6 20 L 16 18 M6 20 L 8 10"
                  delay={1.6}
                />
              </svg>
              <Hand delay={1.8}>{HERO.ctaNote}</Hand>
            </span>
          </div>
        </div>

        {/* Palco do Hermes: 600x740 fixos que escalam (tablet 520px, celular até 420px) */}
        <div
          role="img"
          aria-label={HERO.stageLabel}
          className="max-tab:mx-auto max-tab:mt-12 max-tab:w-full max-tab:max-w-[468px] max-tab:px-6 tab:absolute tab:top-16 tab:right-0 tab:w-[520px] desk:right-[max(110px,calc(50%-610px))] desk:w-[600px]"
        >
          <ScaleBox w={600} h={740} className="overflow-visible!">
            <div className="relative h-[740px] w-[600px]">
              <Burst
                viewBox="0 0 600 740"
                cx={300}
                cy={300}
                r={250}
                n={72}
                min={20}
                max={110}
                seed={7}
                ring
                opacity={0.45}
                delay={0.2}
                dur={2.4}
                style={{
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  maskImage: HALO_MASK,
                  WebkitMaskImage: HALO_MASK,
                }}
              />
              {/* Gravura e ondas andam juntas: as ondas saem do megafone e não podem se separar dele */}
              <HermesFollow className="absolute inset-0">
                {/* enter={false}: já visível no primeiro quadro, como a gravura estática da referência */}
                <Engraving
                  src="/v3/hermes.webp"
                  mobileSrc="/v3/hermes-m.webp"
                  alt={HERO.hermesAlt}
                  width={600}
                  height={740}
                  priority
                  enter={false}
                  className="absolute inset-0 h-full w-full"
                />
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible [transform:translate(-38px,-14px)]"
                  viewBox="0 0 600 740"
                  aria-hidden="true"
                >
                  {ONDAS.map((d, i) => (
                    <Pen key={d} d={d} thin delay={Math.round((0.8 + i * 0.03) * 100) / 100} dur={0.5} />
                  ))}
                  <Pen
                    d="M640 236 C 650 200, 620 176, 600 166"
                    thin
                    dashed="4 6"
                    delay={1.6}
                  />
                  <Pen
                    d="M560 636 C 610 610, 640 520, 640 440 M640 440 L 632 452 M640 440 L 648 452"
                    delay={2.1}
                  />
                </svg>
              </HermesFollow>
              <div
                className="pop absolute top-[118px] left-[395px] z-[3] desk:left-[430px] rounded-[16px_16px_16px_4px] bg-brand px-4 py-3 text-[15px] whitespace-nowrap text-chalk"
                style={settle(1.8)}
              >
                {HERO.message}
              </div>
              <Hand
                delay={2.2}
                className="absolute top-[640px] left-[300px] text-[26px] whitespace-nowrap"
              >
                {HERO.note}
              </Hand>
            </div>
          </ScaleBox>
        </div>
      </div>
    </section>
  );
}
