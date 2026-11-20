import { Burst, Engraving, Hand } from "@/components/v3/ink";
import { CASES } from "@/lib/content-v3";
import { cn } from "@/lib/utils";
import { CaseFrame } from "./CaseFrame";

const c = CASES.arasuper;

const TONES = {
  green: "bg-case-green text-chalk",
  yellow: "bg-case-yellow text-case-navy",
  white: "bg-chalk text-case-green",
} as const;

/** Some nas bordas de cima e de baixo para as colunas não terminarem num corte seco. */
const FADE =
  "linear-gradient(transparent, var(--color-ink) 16%, var(--color-ink) 84%, transparent)";
const fadeStyle = { maskImage: FADE, WebkitMaskImage: FADE };

function Tile({
  tone,
  text,
  compact,
}: {
  tone: keyof typeof TONES;
  text: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex aspect-[4/5] flex-col justify-end rounded-[14px] font-display leading-[1.05] font-medium tracking-[-0.02em]",
        compact ? "p-4 text-[17px]" : "p-5 text-[22px]",
        TONES[tone],
      )}
    >
      {text}
      <small className="mt-2 font-sans text-[12px] tracking-normal">
        {c.tileBrand}
      </small>
    </div>
  );
}

/**
 * Colunas de artes em laço de 30s. Cada coluna repete as três artes uma vez
 * para o laço fechar sem salto, e o `pb-5` completa o intervalo entre a
 * última arte e a primeira repetida: o deslocamento de -50% fica exato.
 */
function Colunas({ count, compact }: { count: 2 | 3; compact?: boolean }) {
  return (
    <div
      className={cn(
        "grid gap-5",
        count === 3 ? "grid-cols-3" : "grid-cols-2",
      )}
    >
      {c.columns.slice(0, count).map((col, i) => (
        <div
          key={i}
          className={cn(
            "loop-col flex min-w-0 flex-col gap-5 pb-5",
            col.reverse && "rev",
          )}
          style={{ marginTop: compact ? col.marginTop / 2 : col.marginTop }}
        >
          {[...col.tiles, ...col.tiles].map((t, j) => (
            <Tile key={j} tone={t.tone} text={t.text} compact={compact} />
          ))}
        </div>
      ))}
    </div>
  );
}

const BURST = {
  viewBox: "0 0 360 560",
  cx: 180,
  cy: 190,
  r: 150,
  n: 72,
  min: 20,
  max: 90,
  seed: 19,
  tone: "accent",
  opacity: 0.4,
  delay: 0.2,
  dur: 1.8,
} as const;

export function Arasuper() {
  return (
    <CaseFrame
      label={c.stageLabel}
      name={c.name}
      description={c.description}
      pause={{ pause: c.pause, resume: c.resume }}
      desk={
        <>
          <Burst
            {...BURST}
            className="top-[20px] right-[20px] h-[560px] w-[360px]"
          />
          <Engraving
            src="/v3/higia.webp"
            alt={c.statueAlt}
            width={360}
            height={560}
            className="absolute top-[20px] right-[20px] h-[560px] w-[360px]"
          />
          <Hand
            delay={1}
            className="absolute top-[530px] right-[80px] z-[3] text-[24px] whitespace-nowrap"
          >
            {c.note}
          </Hand>
          <div
            className="absolute inset-y-0 left-0 right-[400px] overflow-hidden pr-6 pl-16"
            style={fadeStyle}
          >
            <Colunas count={3} />
          </div>
        </>
      }
      mobile={
        <>
          <div className="relative h-[320px]">
            <div className="relative mx-auto h-[320px] w-[206px]">
              <Burst {...BURST} className="inset-0 h-full w-full" />
              <Engraving
                src="/v3/higia.webp"
                alt={c.statueAlt}
                width={360}
                height={560}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <Hand
              delay={1}
              className="absolute right-4 bottom-2 z-[3] text-[20px] whitespace-nowrap"
            >
              {c.note}
            </Hand>
          </div>
          <div
            className="relative h-[420px] overflow-hidden px-6"
            style={fadeStyle}
          >
            <Colunas count={2} compact />
          </div>
        </>
      }
    />
  );
}
