"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/* =========================================================================
   ScrubWords — parágrafo que "acende" palavra por palavra conforme o scroll.
   Dá ritmo de leitura ao manifesto sem precisar prender a página.

   Em `prefers-reduced-motion` a estrutura da árvore é exatamente a mesma —
   só as faixas de interpolação viram constantes. Trocar a árvore por
   preferência de movimento quebraria a hidratação, já que o servidor não
   conhece a preferência do visitante.
   ========================================================================= */

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  // 0.42 é o piso: mantém o efeito de "acender" e ainda passa contraste AA
  // para texto grande. Abaixo disso o parágrafo fica ilegível parado.
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.42, 1]);
  const y = useTransform(progress, range, still ? [0, 0] : [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}

export function ScrubWords({
  text,
  className,
  highlight = [],
}: {
  text: string;
  className?: string;
  /** Palavras (exatas, sem pontuação) que recebem o degradê da marca. */
  highlight?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const still = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = text.split(" ");
  const step = 1 / words.length;

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,;:!?—]/g, "");
        const isHot = highlight.includes(clean);
        return (
          <span key={i}>
            <Word
              progress={scrollYProgress}
              range={[i * step, i * step + step * 3]}
              still={still}
            >
              <span className={isHot ? "text-gradient" : undefined}>
                {word}
              </span>
            </Word>
            {/* mantém o espaço entre palavras selecionável */}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
