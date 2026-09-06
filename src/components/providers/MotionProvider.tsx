"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * MotionProvider — dois ajustes globais:
 *
 * - `reducedMotion="user"`: o Motion passa a ignorar animações de transform e
 *   opacity quando o sistema pede menos movimento. Resolve acessibilidade no
 *   nível certo (a biblioteca), sem que cada componente precise ramificar a
 *   própria árvore — o que causaria divergência de hidratação, já que o
 *   servidor não conhece a preferência do visitante.
 *
 * - `transition`: a curva da Versa como padrão de tudo que não define a sua.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
