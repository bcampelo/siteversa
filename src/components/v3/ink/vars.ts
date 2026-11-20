import type { CSSProperties } from "react";

/**
 * Estilo com variáveis CSS. O React tipa `style` só com propriedades
 * conhecidas, então as variáveis (`--d`, `--dur`, `--r`) passam por aqui.
 */
export function cssVars(
  vars: Record<`--${string}`, string | number | undefined>,
  extra?: CSSProperties,
): CSSProperties {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(vars)) {
    if (v !== undefined) out[k] = v;
  }
  return { ...out, ...extra } as CSSProperties;
}

/** Segundos para o formato que o CSS espera (`1.2` vira `1.2s`). */
export function sec(n: number | undefined): string | undefined {
  return n === undefined ? undefined : `${n}s`;
}
