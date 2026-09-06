"use client";

import { motion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal — entrada padrão do site: sobe com um leve blur e opacidade.
 *
 * Um único componente garante que todas as seções compartilhem o mesmo ritmo
 * e a mesma curva. Consistência de motion é o que separa "site com animação"
 * de "site com direção de movimento".
 *
 * `prefers-reduced-motion` não é tratado aqui: o `<MotionConfig
 * reducedMotion="user">` no layout faz o Motion ignorar transform e opacity
 * globalmente. Ramificar a árvore por preferência de movimento causaria
 * divergência de hidratação — o servidor não sabe o que o usuário prefere.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 26,
  blur = true,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
}) {
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/** Container que orquestra filhos <RevealItem/> em cascata. */
export function RevealGroup({
  children,
  className,
  stagger = 0.075,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: ElementType;
}) {
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {children}
    </Tag>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
