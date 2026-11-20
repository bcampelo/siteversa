import { Hand, ScaleBox } from "@/components/v3/ink";
import { ROADMAP } from "@/lib/content-v3";
import { StepIcon } from "./icons";
import { RoadmapTrail } from "./RoadmapTrail";

/** Palco do desktop e do tablet: 1120x1400, escalado pelo ScaleBox. */
const W = 1120;
const H = 1400;

/** Linha da caneta, em zigue-zague de ponto a ponto. */
const PATH =
  "M560 0 C 560 60, 440 50, 440 110 C 440 220, 680 220, 680 330 C 680 440, 440 440, 440 550 C 440 660, 680 660, 680 770 C 680 880, 440 880, 440 990 C 440 1100, 680 1100, 680 1210 C 680 1300, 560 1290, 560 1360";

/** Um ponto por etapa. Ímpares à esquerda da linha, pares à direita. */
const DOTS = [
  [440, 110],
  [680, 330],
  [440, 550],
  [680, 770],
  [440, 990],
  [680, 1210],
] as const;

type Step = (typeof ROADMAP.steps)[number];

function StepBody({
  step,
  index,
  align,
}: {
  step: Step;
  index: number;
  align: "left" | "right";
}) {
  return (
    <div className="rm-body">
      <StepIcon index={index} align={align} />
      <span className="mt-5 block font-hand text-[30px] leading-none text-brand">
        {step.num}
      </span>
      <h3 className="mt-1 font-display text-[34px] leading-[1.18] font-medium tracking-[-0.04em]">
        {step.title}
      </h3>
      <p
        className={`mt-1.5 max-w-[310px] text-[16px] leading-[1.6] text-pretty text-muted ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        {step.text}
      </p>
    </div>
  );
}

/** Ponta de caneta. O RoadmapTrail a posiciona; sem ele ela fica escondida. */
function Tip() {
  return (
    <svg
      data-rm-tip=""
      className="rm-tip"
      width={44}
      height={44}
      viewBox="0 0 44 44"
      aria-hidden="true"
    >
      <path d="M4 40 L10 26 L34 2 L42 10 L18 34 Z" fill="var(--color-ink)" />
      <path d="M4 40 L10 26 L18 34 Z" fill="var(--color-brand)" />
    </svg>
  );
}

function Back({ className }: { className?: string }) {
  return (
    <div data-rm-end="" className={className}>
      <Hand as="p" className="text-[28px] whitespace-nowrap text-brand!">
        {ROADMAP.back}
      </Hand>
    </div>
  );
}

/**
 * As seis etapas como uma linha de caneta desenhada pela rolagem
 * (RoadmapTrail). Duas variantes no HTML, uma escondida pelo breakpoint:
 * o palco escalado do tablet para cima, e a linha vertical do celular.
 */
export function Roadmap() {
  return (
    <RoadmapTrail>
      <div data-rm-variant="desk" className="max-tab:hidden">
        {/* overflow visível: a nota de volta fica na borda de baixo do palco */}
        <ScaleBox w={W} h={H} className="overflow-visible!">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${W} ${H}`}
            aria-hidden="true"
          >
            <path d={PATH} className="rm-guide" />
            <path d={PATH} className="rm-line" data-rm-path="" />
            {DOTS.map(([cx, cy]) => (
              <circle key={cy} className="rm-dot" data-rm-dot="" cx={cx} cy={cy} r={9} />
            ))}
          </svg>

          <ol className="contents">
            {ROADMAP.steps.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={s.num}
                  data-rm-step=""
                  className={`rm-step absolute w-[400px] ${left ? "text-right" : "text-left"}`}
                  // O topo da etapa fica 70px acima do ponto dela
                  style={{ top: DOTS[i][1] - 70, left: left ? 0 : 720 }}
                >
                  <StepBody step={s} index={i} align={left ? "right" : "left"} />
                </li>
              );
            })}
          </ol>

          <Tip />
          <Back className="absolute top-[1380px] left-1/2 -translate-x-1/2" />
        </ScaleBox>
      </div>

      {/* Celular: linha vertical à esquerda (x 24), etapas à direita, sem ScaleBox */}
      <div data-rm-variant="mob" className="relative tab:hidden">
        <div
          className="rm-mguide pointer-events-none absolute top-0 bottom-0 left-[23px]"
          aria-hidden="true"
        />
        <div
          data-rm-line=""
          className="rm-mline pointer-events-none absolute top-0 bottom-0 left-[22.5px] w-[3px]"
          aria-hidden="true"
        />
        <ol>
          {ROADMAP.steps.map((s, i) => (
            <li key={s.num} data-rm-step="" className="rm-step relative pb-14 pl-14">
              {/* Na altura do título: 56 (ícone) + 20 + 30 (número) + 4 + metade do título, menos o raio */}
              <span
                data-rm-dot=""
                className="rm-mdot absolute top-[121px] left-[15px] z-[1] block h-[18px] w-[18px] rounded-full"
                aria-hidden="true"
              />
              <StepBody step={s} index={i} align="left" />
            </li>
          ))}
        </ol>
        <Tip />
        <Back className="pl-14" />
      </div>
    </RoadmapTrail>
  );
}
