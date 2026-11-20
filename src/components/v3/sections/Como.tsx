import {
  Burst,
  DrawGroup,
  Engraving,
  Hand,
  Pen,
  ScaleBox,
  Underline,
} from "@/components/v3/ink";
import { COMO } from "@/lib/content-v3";

const NODE =
  "rounded-[18px] border-[1.5px] border-ink bg-chalk p-6 text-pretty";

function Passo({ num, title, text }: (typeof COMO.steps)[number]) {
  return (
    <>
      <span className="block text-[15px] leading-[1.55] text-brand">{num}</span>
      <h3 className="mt-3 mb-2 font-display text-[30px] leading-[1.55] font-medium tracking-[-0.04em]">
        {title}
      </h3>
      <p className="text-[16px] leading-[1.55] text-muted">{text}</p>
    </>
  );
}

/** Traço curto entre dois passos empilhados, no celular. */
function Conector({ delay }: { delay: number }) {
  return (
    <svg
      className="mx-auto block h-10 w-6 overflow-visible"
      viewBox="0 0 24 40"
      aria-hidden="true"
    >
      <Pen d="M12 2 C 4 14, 20 26, 12 38" tone="brand" delay={delay} />
    </svg>
  );
}

/**
 * Três grupos separados em vez de um grupo com outro dentro: assim os
 * conectores do fluxo só se desenham quando o fluxo chega à tela, e não
 * junto com a mão gravada lá em cima. Cada grupo tem o seu observer.
 */
export function Como() {
  return (
    <section
      id="como"
      className="paper relative overflow-clip bg-chalk py-24 text-ink tab:py-36"
    >
      <DrawGroup className="pointer-events-none absolute inset-0">
        <Burst
          viewBox="0 0 440 600"
          cx={220}
          cy={250}
          r={180}
          n={72}
          min={20}
          max={90}
          seed={23}
          ring
          tone="muted"
          opacity={0.35}
          delay={0.2}
          dur={1.8}
          className="top-[-60px] right-[-120px] h-[700px] w-[520px] max-tab:top-[-20px] max-tab:right-[-40px] max-tab:h-[410px] max-tab:w-[300px]"
        />
        <Engraving
          src="/v3/mao-caneta.webp"
          alt={COMO.handAlt}
          width={480}
          height={580}
          className="absolute top-[-100px] right-[-60px] h-[580px] w-[480px] max-tab:top-[-20px] max-tab:right-[-20px] max-tab:h-[314px] max-tab:w-[260px] max-tab:opacity-60"
        />
      </DrawGroup>

      <div className="wrap relative">
        <DrawGroup className="mb-12 grid gap-4 tab:mb-24">
          <h2 className="max-w-[16ch] font-display text-[40px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[64px]">
            {COMO.title.before}
            <Underline d="M3 12 C 80 6, 180 15, 297 8">
              {COMO.title.underlined}
            </Underline>
            {COMO.title.after}
          </h2>
          <p className="max-w-[40ch] text-muted">{COMO.lede}</p>
        </DrawGroup>

        <DrawGroup>
          {/* Tablet e desktop: os três passos lado a lado, em 1120x288 que escala */}
          {/* overflow visível: a nota de volta passa 14px da altura do fluxo */}
          <ScaleBox w={1120} h={288} className="overflow-visible! max-tab:hidden">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 1120 300"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <Pen tone="brand" delay={0.4} d="M342 90 C 372 70, 392 70, 418 90" />
              <Pen tone="brand" delay={0.8} d="M722 90 C 752 70, 772 70, 798 90" />
              <Pen
                tone="brand"
                delay={1.2}
                dur={1.4}
                d="M930 200 C 930 300, 190 300, 190 210"
              />
            </svg>
            <ol className="contents">
              {COMO.steps.map((s, i) => (
                <li
                  key={s.num}
                  className={`${NODE} absolute top-0 h-[192px] w-[309px]`}
                  style={{ left: i * 405.33 }}
                >
                  <Passo {...s} />
                </li>
              ))}
            </ol>
            {/* O PNG aprovado mostra a nota começando no meio do fluxo (a referência põe left: 50%) */}
            <Hand
              delay={2.2}
              className="absolute top-[275px] left-1/2 text-[26px] whitespace-nowrap text-brand!"
            >
              {COMO.back}
            </Hand>
          </ScaleBox>

          {/* Celular: passos empilhados, traços curtos no lugar dos conectores, sem o laço de volta */}
          <div className="tab:hidden">
            <ol>
              {COMO.steps.map((s, i) => (
                <li key={s.num}>
                  {i > 0 && <Conector delay={i === 1 ? 0.4 : 0.8} />}
                  <div className={NODE}>
                    <Passo {...s} />
                  </div>
                </li>
              ))}
            </ol>
            <Hand
              as="p"
              delay={1.2}
              className="mt-6 text-center text-[22px] text-brand!"
            >
              {COMO.back}
            </Hand>
          </div>
        </DrawGroup>
      </div>
    </section>
  );
}
