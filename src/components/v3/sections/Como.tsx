import {
  Burst,
  DrawGroup,
  Engraving,
  Parallax,
  RevealTitle,
  Underline,
} from "@/components/v3/ink";
import { ROADMAP } from "@/lib/content-v3";
import { Roadmap } from "./como/Roadmap";

/**
 * "Como trabalhamos": seis etapas numa linha de caneta que a rolagem
 * desenha (como/Roadmap). A mão gravada e os raios continuam no canto, como
 * na rodada 1.
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
        <Parallax>
          <Engraving
            src="/v3/mao-caneta.webp"
            alt={ROADMAP.handAlt}
            width={480}
            height={580}
            className="absolute top-[-100px] right-[-60px] h-[580px] w-[480px] max-tab:top-[-20px] max-tab:right-[-20px] max-tab:h-[314px] max-tab:w-[260px] max-tab:opacity-60"
          />
        </Parallax>
      </DrawGroup>

      <div className="wrap relative">
        <DrawGroup className="mb-12 grid gap-4 tab:mb-24">
          <RevealTitle className="max-w-[16ch] font-display text-[40px] leading-none font-medium tracking-[-0.04em] text-balance [overflow-wrap:break-word] tab:text-[64px]">
            {ROADMAP.title.before}
            <Underline d="M3 12 C 80 6, 180 15, 297 8">
              {ROADMAP.title.underlined}
            </Underline>
            {ROADMAP.title.after}
          </RevealTitle>
          <p className="max-w-[40ch] text-[17px] leading-[1.55] text-muted">{ROADMAP.lede}</p>
        </DrawGroup>

        <Roadmap />
      </div>
    </section>
  );
}
