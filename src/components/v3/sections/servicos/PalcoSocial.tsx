import {
  Burst,
  Engraving,
  Hand,
  Pen,
  PenRect,
  cssVars,
} from "@/components/v3/ink";
import { SERVICOS } from "@/lib/content-v3";
import { Palco, camada, viewBox } from "./Palco";

const { post, tag, stageLabel } = SERVICOS.items.social;

export function PalcoSocial() {
  return (
    <Palco label={stageLabel}>
      <svg className={`sk ${camada}`} viewBox={viewBox} aria-hidden="true">
        <PenRect x={188} y={34} w={240} h={266} rx={14} tone="fog" delay={0.1} />
        <Pen d="M198 44 L418 210 M418 44 L198 210" tone="fog" delay={0.35} />
        <Pen
          d="M206 222 q 12 -6 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 M206 246 q 12 -6 24 0 t 24 0 t 24 0 t 24 0"
          delay={0.6}
        />
        <Pen d="M198 284 H270" tone="fog" delay={0.8} />
      </svg>
      <svg
        className={`${camada} pointer-events-none z-[2]`}
        viewBox={viewBox}
        aria-hidden="true"
      >
        <Pen
          d="M470 150 C 450 170, 420 200, 372 222 M372 222 L 384 212 M372 222 L 386 226"
          delay={0.9}
        />
      </svg>
      <Burst
        viewBox={viewBox}
        cx={308}
        cy={150}
        r={150}
        n={60}
        min={10}
        max={60}
        seed={11}
        opacity={0.5}
        delay={1.1}
        dur={1.4}
        style={{ inset: 0, width: "100%", height: "100%" }}
      />
      <div
        className="final absolute top-[34px] left-1/2 -ml-[120px] w-[240px] rounded-[14px] border border-line-dark bg-ink p-2"
        style={cssVars({ "--d": "1.2s" })}
      >
        {/* Miniatura gravada em branco; o alfa já vem assado, sem filter */}
        <div className="h-[164px] overflow-hidden rounded-[9px] bg-ink">
          <Engraving
            src="/v3/post-hermes.webp"
            alt=""
            width={224}
            height={164}
            enter={false}
            className="block h-full w-full"
          />
        </div>
        <b className="block px-1 pt-3 font-display text-[19px] leading-[1.08] font-medium tracking-[-0.02em]">
          {post.caption}
        </b>
        <div className="px-1 pt-2 text-[13px] text-fog">{post.handle}</div>
      </div>
      <Hand
        delay={1}
        className="absolute top-[96px] left-[448px] z-[2] text-[24px]"
      >
        {tag}
      </Hand>
    </Palco>
  );
}
