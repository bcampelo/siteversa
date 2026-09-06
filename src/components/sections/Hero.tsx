"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon, Button, WhatsAppIcon } from "@/components/ui/Button";
import { SERVICES } from "@/lib/content";
import { CTA, SITE } from "@/lib/site";
import { useMediaQuery } from "@/lib/useMediaQuery";

// A cena 3D nunca bloqueia o conteúdo: entra depois, só no cliente.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const TRUST = [
  "Diagnóstico gratuito",
  "Resposta em até 24h",
  "Zero template pronto",
];

/**
 * Hero
 *
 * Toda a entrada do hero é feita em CSS (classes `hero-line` e `hero-fade`,
 * com delays em `--d`). O JS aqui só adiciona o que é opcional: a cena 3D e
 * o parallax de scroll. Consequência prática: a headline — o elemento de LCP
 * — pinta sem esperar um único byte de JavaScript.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Orçamento de performance da cena 3D — três condições, todas necessárias:
   *
   * 1. Viewport de desktop. No celular, os ~500 KB de WebGL sairiam do
   *    orçamento de JS inteiro para enfeitar um fundo que o halo em CSS já
   *    resolve com elegância.
   * 2. Thread principal livre (`requestIdleCallback`).
   * 3. Movimento não reduzido.
   */
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [idle, setIdle] = useState(false);
  const canRender3D = isDesktop && idle && !reduce;

  useEffect(() => {
    if (reduce || !isDesktop) return;
    const wake = () => setIdle(true);
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(wake, { timeout: 2400 })
      : window.setTimeout(wake, 1000);
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle as number);
      else clearTimeout(handle as number);
    };
  }, [reduce, isDesktop]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // O conteúdo afunda de leve enquanto o fundo fica: profundidade sem exagero
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pb-8 pt-32 sm:pb-12 lg:pt-36"
    >
      {/* ---------- Fundo ---------- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={reduce ? undefined : { scale: bgScale }}
      >
        <div className="bg-grid absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(72%_58%_at_50%_38%,black,transparent)]" />
        <div className="halo absolute left-1/2 top-[8%] size-[62rem] max-w-[150vw] -translate-x-1/2 animate-breathe blur-[90px]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />
        {canRender3D && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroCanvas />
          </motion.div>
        )}
      </motion.div>

      {/* ---------- Conteúdo ---------- */}
      <motion.div
        className="shell relative flex flex-1 flex-col justify-center"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-[68rem]">
          {/* chip de status */}
          <div
            className="hero-fade mb-8 inline-flex items-center gap-2.5 rounded-full border border-chalk/12 bg-chalk/[0.03] py-1.5 pl-2.5 pr-4 backdrop-blur-md"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-soft/70" />
              <span className="relative size-1.5 rounded-full bg-brand-soft" />
            </span>
            <span className="text-eyebrow text-fog">
              Empresa de tecnologia
              <span className="max-sm:hidden"> · aceitando projetos</span>
            </span>
          </div>

          <h1 className="text-hero">
            <span
              className="hero-line line-mask"
              style={{ "--d": "60ms" } as React.CSSProperties}
            >
              <span className="block">Sua empresa</span>
            </span>
            <span
              className="hero-line line-mask"
              style={{ "--d": "150ms" } as React.CSSProperties}
            >
              <span className="block">já é boa.</span>
            </span>
            <span
              className="hero-line line-mask"
              style={{ "--d": "240ms" } as React.CSSProperties}
            >
              <span className="text-hero-beat text-gradient block pt-4">
                Falta a internet saber disso.
              </span>
            </span>
          </h1>

          <p
            className="hero-fade text-lede mt-8 max-w-[46ch] text-fog"
            style={{ "--d": "520ms" } as React.CSSProperties}
          >
            A Versa é uma empresa de tecnologia. Unimos{" "}
            <span className="text-chalk">design</span>,{" "}
            <span className="text-chalk">engenharia</span> e{" "}
            <span className="text-chalk">mídia paga</span> para transformar
            presença digital em crescimento real — não em curtida.
          </p>

          <div
            className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ "--d": "640ms" } as React.CSSProperties}
          >
            <Button href={SITE.contact.whatsapp} external size="lg">
              <WhatsAppIcon />
              {CTA.primary}
              <ArrowIcon />
            </Button>
            <Button href="#trabalhos" variant="ghost" size="lg">
              {CTA.secondary}
            </Button>
          </div>

          <ul
            className="hero-fade mt-9 flex flex-wrap items-center gap-x-6 gap-y-2"
            style={{ "--d": "780ms" } as React.CSSProperties}
          >
            {TRUST.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[0.8125rem] text-fog-dim"
              >
                <svg
                  viewBox="0 0 12 12"
                  className="size-3 text-brand-soft"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M2 6.4 4.6 9 10 3.2" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ---------- Rodapé do hero: os três pilares ---------- */}
      <div
        className="hero-fade shell relative mt-14"
        style={{ "--d": "900ms" } as React.CSSProperties}
      >
        <div className="flex flex-col gap-4 border-t border-chalk/8 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a
                  href="#servicos"
                  className="group/pillar flex items-baseline gap-2.5"
                >
                  <span className="text-eyebrow text-brand-soft/60">
                    {s.index}
                  </span>
                  <span className="text-[0.9375rem] text-fog transition-colors duration-300 group-hover/pillar:text-chalk">
                    {s.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#manifesto"
            className="group/scroll hidden items-center gap-3 text-eyebrow text-fog-dim lg:flex"
          >
            <span>Role para conhecer</span>
            <span className="relative grid size-8 place-items-center overflow-hidden rounded-full border border-chalk/12">
              <svg
                viewBox="0 0 12 16"
                className="size-3 transition-transform duration-700 ease-versa group-hover/scroll:translate-y-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 2v12M2 10l4 4 4-4" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
