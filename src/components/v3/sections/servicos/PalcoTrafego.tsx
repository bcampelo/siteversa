import { Burst, Hand, Pen, cssVars } from "@/components/v3/ink";
import { SERVICOS } from "@/lib/content-v3";
import { Palco, camada, viewBox } from "./Palco";

const { chart, tag, stageLabel } = SERVICOS.items.trafego;

export function PalcoTrafego() {
  return (
    <Palco label={stageLabel}>
      <svg className={`sk ${camada}`} viewBox={viewBox} aria-hidden="true">
        <Pen
          d="M40 62 q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 M40 94 q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 M40 126 q 15 -6 30 0 t 30 0 t 30 0 t 30 0"
          tone="fog"
          delay={0.1}
        />
        <Pen d="M40 340 H576 M40 340 V160" tone="fog" delay={0.35} />
        <Pen
          d="M40 322 L111 298 L183 312 L254 266 L326 284 L397 230 L469 224 L576 168"
          delay={0.6}
        />
      </svg>
      <svg
        className={`${camada} pointer-events-none z-[2]`}
        viewBox={viewBox}
        aria-hidden="true"
      >
        <Pen
          d="M410 172 C 420 196, 418 214, 404 232 M404 232 L 406 220 M404 232 L 394 226"
          delay={1}
        />
      </svg>
      <Burst
        viewBox={viewBox}
        cx={576}
        cy={168}
        r={14}
        n={24}
        min={15}
        max={45}
        seed={3}
        tone="accent"
        delay={1.6}
        dur={0.8}
        style={{ inset: 0, width: "100%", height: "100%", zIndex: 1 }}
      />
      <div
        className="final absolute inset-10"
        style={cssVars({ "--d": "1.2s" })}
      >
        <b className="block max-w-[16ch] font-display text-[28px] leading-[1.05] font-medium tracking-[-0.03em]">
          {chart.title}
        </b>
        <svg
          className="absolute right-0 bottom-0 left-0 h-[190px] w-full"
          viewBox="0 0 600 190"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 170 L80 150 L160 156 L240 120 L320 128 L400 84 L480 70 L600 22"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
          />
          <circle cx="600" cy="22" r="5" fill="var(--color-chalk)" />
        </svg>
      </div>
      <Hand
        delay={1.1}
        className="absolute top-[140px] left-[360px] z-[2] text-[24px]"
      >
        {tag}
      </Hand>
    </Palco>
  );
}
