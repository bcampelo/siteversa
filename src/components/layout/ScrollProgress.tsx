"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Fio de luz no topo indicando o avanço da leitura. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-brand-deep via-brand to-brand-soft"
    />
  );
}
