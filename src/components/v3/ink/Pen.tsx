import { cn } from "@/lib/utils";
import { cssVars, sec } from "./vars";

type Tone = "accent" | "fog" | "brand";

export type PenStyleProps = {
  /** Atraso em segundos, vem do `--d` da referência. */
  delay?: number;
  /** Duração em segundos, vem do `--dur` da referência. */
  dur?: number;
  tone?: Tone;
  /** Traço fino (1.2). */
  thin?: boolean;
  /** Largura do traço, para os poucos casos que fogem de 2 e 1.2. */
  width?: number;
  /**
   * Linha tracejada. `true` usa "4 6"; uma string troca o padrão (ex.: "5 7").
   * Tracejado não combina com revelar por stroke-dashoffset, então entra por
   * opacidade e não leva pathLength.
   */
  dashed?: boolean | string;
  className?: string;
};

function penAttrs({
  delay,
  dur,
  tone = "accent",
  thin,
  width,
  dashed,
  className,
}: PenStyleProps) {
  return {
    className: cn(
      "ink pen",
      thin && "thin",
      tone !== "accent" && tone,
      dashed && "dashed",
      className,
    ),
    style: cssVars(
      {
        "--d": sec(delay),
        "--dur": sec(dur),
        "--dash": typeof dashed === "string" ? dashed : undefined,
      },
      width ? { strokeWidth: width } : undefined,
    ),
    // pathLength=1 deixa o traço medir 1 em qualquer comprimento real
    pathLength: dashed ? undefined : (1 as const),
  };
}

/** Traço de caneta. Pai precisa estar dentro de um <DrawGroup>. */
export function Pen({ d, ...rest }: { d: string } & PenStyleProps) {
  return <path d={d} {...penAttrs(rest)} />;
}

export function PenRect({
  x,
  y,
  w,
  h,
  rx,
  ...rest
}: { x: number; y: number; w: number; h: number; rx?: number } & PenStyleProps) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} {...penAttrs(rest)} />;
}

export function PenCircle({
  cx,
  cy,
  r,
  ...rest
}: { cx: number; cy: number; r: number } & PenStyleProps) {
  return <circle cx={cx} cy={cy} r={r} {...penAttrs(rest)} />;
}
