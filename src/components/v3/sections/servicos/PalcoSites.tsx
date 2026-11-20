import {
  Burst,
  Hand,
  Pen,
  PenRect,
  cssVars,
} from "@/components/v3/ink";
import { SERVICOS } from "@/lib/content-v3";
import { Palco, camada, viewBox } from "./Palco";

const { page, bubble, tag, stageLabel } = SERVICOS.items.sites;

export function PalcoSites() {
  return (
    <Palco label={stageLabel}>
      <svg className={`sk ${camada}`} viewBox={viewBox} aria-hidden="true">
        <PenRect x={56} y={44} w={380} h={232} rx={12} tone="fog" delay={0.1} />
        <Pen
          d="M84 88 H340 M84 120 H250 M84 156 H380 M84 174 H320"
          tone="fog"
          delay={0.35}
        />
        <PenRect x={84} y={200} w={150} h={38} rx={19} delay={0.6} />
        <PenRect
          x={386}
          y={288}
          w={190}
          h={44}
          rx={16}
          tone="fog"
          dashed="5 7"
          delay={0.8}
        />
      </svg>
      <svg
        className={`${camada} pointer-events-none z-[2]`}
        viewBox={viewBox}
        aria-hidden="true"
      >
        <Pen
          d="M300 330 C 280 310, 260 280, 240 252 M240 252 L 242 266 M240 252 L 252 260"
          delay={1}
        />
      </svg>
      {/* Peça ilustrativa: o botão é um span, o palco inteiro não é interativo */}
      <div
        className="final absolute top-[44px] left-[56px] w-[380px] rounded-[12px] bg-chalk p-7 text-ink"
        style={cssVars({ "--d": "1.2s" })}
      >
        <b className="mb-3 block font-display text-[30px] leading-[1.02] font-medium tracking-[-0.03em]">
          {page.title}
        </b>
        <p className="mb-5 text-[14px] text-muted">{page.text}</p>
        <span
          aria-hidden="true"
          className="inline-flex h-[38px] items-center rounded-full bg-brand px-4 text-[14px] text-chalk"
        >
          {page.button}
        </span>
      </div>
      <Burst
        viewBox={viewBox}
        cx={481}
        cy={310}
        r={110}
        n={18}
        min={10}
        max={30}
        seed={5}
        from={180}
        to={360}
        tone="accent"
        opacity={0.7}
        delay={2.1}
        dur={0.6}
        style={{ inset: 0, width: "100%", height: "100%" }}
      />
      <div
        className="final absolute right-10 bottom-12 rounded-[16px_16px_4px_16px] bg-brand px-4 py-3 text-[15px] text-chalk"
        style={cssVars({ "--d": "1.9s" })}
      >
        {bubble}
      </div>
      <Hand
        delay={1.1}
        className="absolute top-[326px] left-[250px] z-[2] text-[24px]"
      >
        {tag}
      </Hand>
    </Palco>
  );
}
