import type { ReactNode } from "react";
import { cssVars, sec } from "./vars";

/**
 * Sublinhado de caneta embaixo de um trecho do título. O trecho vai em
 * `children`; `d` é o traço no viewBox 0 0 300 20, copiado da referência.
 * No papel claro (ancestral `.paper`) a tinta vira brand.
 */
export function Underline({
  d,
  delay = 0.4,
  children,
}: {
  d: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <span className="u">
      {children}
      <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="pen"
          d={d}
          pathLength={1}
          style={cssVars({ "--d": sec(delay), "--dur": ".7s" })}
        />
      </svg>
    </span>
  );
}
