"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PROCESS, type ProcessStep } from "@/lib/content";

/**
 * Método — no desktop as etapas correm na horizontal enquanto a página
 * rola na vertical. Quebra o ritmo depois de duas seções empilhadas e
 * comunica "processo" pelo próprio movimento.
 * No mobile e em reduced-motion, vira uma lista vertical limpa.
 */
export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [horizontal, setHorizontal] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const check = () => {
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      setHorizontal(wide && !reduce);
      const track = trackRef.current;
      if (track) {
        setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 96));
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [reduce]);

  /**
   * `target` só é informado quando o trilho horizontal existe de fato. Na
   * primeira renderização (e no mobile) o elemento nunca é montado — passar
   * um ref vazio faria o useScroll observar um alvo inexistente.
   */
  const { scrollYProgress } = useScroll({
    target: horizontal ? sectionRef : undefined,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0005,
  });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progressWidth = useTransform(smooth, [0, 1], ["6%", "100%"]);

  const heading = (
    <SectionHeading
      index="07"
      eyebrow="Nosso método"
      title={
        <>
          Estratégia primeiro. <span className="text-gradient">Sempre.</span>
        </>
      }
      lede="Quatro etapas, nenhuma pulada. É o que separa um projeto que gera resultado de um projeto que gera entrega."
    />
  );

  if (!horizontal) {
    return (
      <section id="processo" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="shell">{heading}</div>
        <div className="shell mt-14 flex flex-col gap-4">
          {PROCESS.map((step, i) => (
            <Reveal key={step.index} delay={i * 0.05}>
              <StepCard step={step} stacked />
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="processo" className="relative scroll-mt-24">
      <div
        ref={sectionRef}
        /*
          158vh no lugar dos 320vh anteriores.

          A rolagem horizontal continua inteira, só que mapeada para menos
          rolagem vertical. Antes o visitante precisava atravessar mais de
          três telas de método para chegar em Trabalhos, que é a prova, ou
          seja, o trecho mais longo do site ficava exatamente na frente do
          argumento mais forte dele.
        */
        style={{ height: `${70 + PROCESS.length * 22}vh` }}
        className="relative"
      >
        {/* O título permanece na tela enquanto as etapas correm: o visitante
            nunca perde o contexto do que está lendo. */}
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 overflow-hidden py-20">
          <div className="shell shrink-0">{heading}</div>

          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max shrink-0 gap-6 pl-[max(1.25rem,calc((100vw-84rem)/2+4.5rem))] pr-24"
          >
            {PROCESS.map((step) => (
              <StepCard key={step.index} step={step} />
            ))}
          </motion.div>

          <div className="shell shrink-0">
            <div className="flex items-center gap-5">
              <span className="text-eyebrow text-fog-dim">Progresso</span>
              <div className="relative h-px flex-1 bg-chalk/10">
                <motion.span
                  style={{ width: progressWidth }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand to-brand-soft"
                />
              </div>
              <span className="text-eyebrow text-fog-dim">04 etapas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  stacked = false,
}: {
  step: ProcessStep;
  stacked?: boolean;
}) {
  return (
    <article
      className={[
        "group/step relative flex flex-col justify-between overflow-hidden rounded-3xl border border-chalk/8 bg-ink-2 p-7 transition-colors duration-500 hover:border-brand-soft/25 sm:p-9",
        stacked
          ? "w-full"
          : // Altura acompanha a viewport: nunca corta conteúdo em telas baixas
            "h-[clamp(21rem,52svh,26rem)] w-[21.5rem] shrink-0",
      ].join(" ")}
    >
      <div
        aria-hidden
        className="halo pointer-events-none absolute -right-24 -top-24 size-64 opacity-0 blur-3xl transition-opacity duration-700 group-hover/step:opacity-40"
      />

      <div className="relative">
        <div className="flex items-baseline justify-between">
          {/* Numeral fantasma: chalk/40 é o piso que ainda passa 3:1 para
              texto grande — abaixo disso ele era decoração ilegível. */}
          <span className="font-display text-[3.25rem] font-bold leading-none tracking-tight text-chalk/40 transition-colors duration-500 group-hover/step:text-brand-soft">
            {step.index}
          </span>
          <span className="text-eyebrow text-fog-dim">{step.duration}</span>
        </div>

        <h3 className="text-title mt-5">{step.title}</h3>
        <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-fog">
          {step.body}
        </p>
      </div>

      <ul className="relative mt-7 flex flex-col gap-2 border-t border-chalk/8 pt-5">
        {step.bullets.map((b) => (
          <li
            key={b}
            className="flex items-center gap-2.5 text-[0.8125rem] text-fog-dim"
          >
            <span aria-hidden className="size-1 rounded-full bg-brand-soft/60" />
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
