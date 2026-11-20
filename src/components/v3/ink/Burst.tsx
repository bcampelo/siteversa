import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { cssVars, sec } from "./vars";

/**
 * Gerador pseudoaleatório com semente (mulberry32). Mesma semente, mesmo
 * desenho a cada carga, e igual ao script da referência.
 */
function rng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Linhas radiais saindo de um círculo, no mesmo algoritmo da referência. */
export function burstPath(p: {
  cx: number;
  cy: number;
  r: number;
  n: number;
  min: number;
  max: number;
  seed: number;
  from?: number;
  to?: number;
}): string {
  const rand = rng(p.seed);
  const a0 = ((p.from ?? 0) * Math.PI) / 180;
  const a1 = ((p.to ?? 360) * Math.PI) / 180;
  let d = "";
  for (let i = 0; i < p.n; i++) {
    const a = a0 + ((a1 - a0) * i) / p.n;
    const len = p.min + (p.max - p.min) * Math.pow(rand(), 1.6);
    const c = Math.cos(a);
    const s = Math.sin(a);
    d += `M${Math.round(p.cx + c * p.r)} ${Math.round(p.cy + s * p.r)}L${Math.round(
      p.cx + c * (p.r + len),
    )} ${Math.round(p.cy + s * (p.r + len))} `;
  }
  return d;
}

const TONE = { fog: "", accent: "ac", muted: "mu" } as const;

export function Burst({
  viewBox,
  cx,
  cy,
  r,
  n,
  min,
  max,
  seed,
  from,
  to,
  ring = false,
  tone = "fog",
  opacity,
  delay = 0,
  dur = 1.4,
  className,
  style,
}: {
  viewBox: string;
  cx: number;
  cy: number;
  r: number;
  n: number;
  min: number;
  max: number;
  seed: number;
  /** Ângulo inicial em graus (padrão 0). */
  from?: number;
  /** Ângulo final em graus (padrão 360). */
  to?: number;
  /** Desenha também o círculo de raio `r`. */
  ring?: boolean;
  tone?: keyof typeof TONE;
  opacity?: number;
  /** Atraso dos raios em segundos. O círculo entra 0.1s antes. */
  delay?: number;
  /** Duração dos raios em segundos. O círculo dura cerca de 2/3 disso. */
  dur?: number;
  className?: string;
  /** Posição e tamanho do SVG (a referência usa inset, width e height). */
  style?: CSSProperties;
}) {
  const d = burstPath({ cx, cy, r, n, min, max, seed, from, to });
  return (
    <svg
      className={cn("burst", TONE[tone], className)}
      viewBox={viewBox}
      aria-hidden="true"
      style={{ ...(opacity !== undefined ? { opacity } : null), ...style }}
    >
      {ring && (
        <circle
          className="pen"
          cx={cx}
          cy={cy}
          r={r}
          pathLength={1}
          style={cssVars({
            "--d": sec(Math.max(delay - 0.1, 0)),
            "--dur": sec(Math.round(dur * 0.65 * 10) / 10),
          })}
        />
      )}
      <path
        className="pen"
        d={d}
        pathLength={1}
        style={cssVars({ "--d": sec(delay), "--dur": sec(dur) })}
      />
    </svg>
  );
}
