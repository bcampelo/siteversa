import {
  Burst,
  Engraving,
  Hand,
  Pen,
  ScaleBox,
  cssVars,
} from "@/components/v3/ink";
import { CASES } from "@/lib/content-v3";
import { cn } from "@/lib/utils";
import { CaseFrame } from "./CaseFrame";

const c = CASES.translima;

/*
  Os anúncios abrem em leque. Deslocamento, rotação e escala usam as
  propriedades individuais `translate`, `rotate` e `scale` (é o que o
  Tailwind 4 escreve). Assim a animação `adin`, que mexe só em `transform`,
  não desfaz o leque durante a entrada.
*/
const AD =
  "adin absolute z-[1] flex aspect-[4/5] w-[272px] flex-col justify-between rounded-[16px] bg-case-blue p-6 text-chalk";
const AD_TITLE =
  "font-display text-[30px] leading-[1.02] font-medium tracking-[-0.03em]";
const AD_BUTTON =
  "self-start rounded-full bg-chalk px-4 py-2 text-[13px] text-case-blue";
const TEMP = "absolute z-[3] text-[24px] whitespace-nowrap";

/**
 * Os três anúncios e a régua frio, morno, quente. `compact` é a caixa do
 * celular (820x480), sem a estátua; o desktop usa as medidas da referência.
 *
 * Ilustrativas: os botões "Chamar no WhatsApp" são span, nada aqui é link.
 */
function Pecas({ compact }: { compact?: boolean }) {
  const anchor = compact ? "left-[274px]" : "left-1/2 -ml-[300px]";
  const adTop = compact ? "top-[30px]" : "top-[84px]";
  const ruler = compact ? 60 : 150;

  return (
    <>
      <div
        className={cn(AD, anchor, adTop, "-translate-x-[260px] -rotate-[7deg] scale-[.86]")}
        style={cssVars({ "--d": ".45s" })}
      >
        <b className={AD_TITLE}>{c.ads.left.title}</b>
        <span className={AD_BUTTON}>{c.ads.left.button}</span>
      </div>
      <div
        className={cn(AD, anchor, adTop, "translate-x-[260px] rotate-[7deg] scale-[.86]")}
        style={cssVars({ "--d": ".55s" })}
      >
        <b className={AD_TITLE}>{c.ads.right.title}</b>
        <span className={AD_BUTTON}>{c.ads.right.button}</span>
      </div>
      <div className={cn(AD, anchor, adTop)}>
        <span className="text-[13px]">{c.ads.center.brand}</span>
        <b className={AD_TITLE}>{c.ads.center.title}</b>
        <span className={AD_BUTTON}>{c.ads.center.button}</span>
      </div>

      <Hand
        delay={0.4}
        className={cn(TEMP, compact ? "top-[395px] left-[50px]" : "top-[500px] left-[110px]")}
      >
        {c.temperatures.cold}
      </Hand>
      {/* A referência põe `left: 50%` e o PNG aprovado mostra a nota começando no meio, então fica assim */}
      <Hand
        delay={0.6}
        className={cn(TEMP, "left-1/2", compact ? "top-[415px]" : "top-[520px]")}
      >
        {c.temperatures.warm}
      </Hand>
      <Hand
        delay={0.8}
        className={cn(TEMP, compact ? "top-[395px] right-[50px]" : "top-[500px] right-[110px]")}
      >
        {c.temperatures.hot}
      </Hand>

      <svg
        className="absolute h-10 overflow-visible"
        style={{
          left: ruler,
          top: compact ? 415 : 520,
          width: `calc(100% - ${ruler * 2}px)`,
        }}
        viewBox="0 0 800 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <Pen d="M10 20 C 200 40, 600 0, 790 20" thin delay={0.3} dur={1.2} />
      </svg>
    </>
  );
}

export function Translima() {
  return (
    <CaseFrame
      label={c.stageLabel}
      name={c.name}
      description={c.description}
      desk={
        <>
          <Burst
            viewBox="0 0 360 560"
            cx={180}
            cy={190}
            r={150}
            n={72}
            min={20}
            max={90}
            seed={17}
            opacity={0.45}
            delay={0.2}
            dur={1.8}
            className="top-[20px] right-[20px] h-[560px] w-[360px]"
          />
          <Engraving
            src="/v3/atlas.webp"
            alt={c.statueAlt}
            width={360}
            height={560}
            className="absolute top-[20px] right-[20px] h-[560px] w-[360px]"
          />
          <Hand
            delay={1}
            className={cn(TEMP, "top-[30px] right-[70px]")}
          >
            {c.note}
          </Hand>
          <Pecas />
        </>
      }
      mobile={
        <>
          <div className="relative h-[320px]">
            <div className="relative mx-auto h-[320px] w-[206px]">
              <Burst
                viewBox="0 0 360 560"
                cx={180}
                cy={190}
                r={150}
                n={72}
                min={20}
                max={90}
                seed={17}
                opacity={0.45}
                delay={0.2}
                dur={1.8}
                className="inset-0 h-full w-full"
              />
              <Engraving
                src="/v3/atlas.webp"
                alt={c.statueAlt}
                width={360}
                height={560}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <Hand
              delay={1}
              className="absolute top-3 right-4 z-[3] text-[20px] whitespace-nowrap"
            >
              {c.note}
            </Hand>
          </div>
          <div className="px-3 pb-3">
            <ScaleBox w={820} h={480}>
              <Pecas compact />
            </ScaleBox>
          </div>
        </>
      }
    />
  );
}
