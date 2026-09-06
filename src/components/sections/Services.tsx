"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type RefObject } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { SERVICES, type Service } from "@/lib/content";
import { SITE } from "@/lib/site";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { ServiceGlyph } from "./ServiceGlyph";

/**
 * Serviços em pilha: cada cartão trava no topo e o seguinte desliza por
 * cima, com o anterior recuando em escala. A leitura fica focada em um
 * serviço por vez, sem a sensação de lista comprida.
 */
export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canStack = useMediaQuery("(min-width: 1024px)");

  return (
    <section id="servicos" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="O que fazemos"
          title={
            <>
              Três frentes. Um objetivo:{" "}
              <span className="text-gradient">crescimento.</span>
            </>
          }
          lede="Não vendemos peça avulsa. Vendemos o resultado que a peça precisa produzir — e cuidamos de tudo que existe entre as duas coisas."
        />
      </div>

      <div ref={containerRef} className="shell relative mt-16 sm:mt-20">
        {SERVICES.map((service, i) => (
          <StackedCard
            key={service.id}
            service={service}
            index={i}
            total={SERVICES.length}
            containerRef={containerRef}
            stack={canStack}
          />
        ))}
      </div>
    </section>
  );
}

function StackedCard({
  service,
  index,
  total,
  containerRef,
  stack,
}: {
  service: Service;
  index: number;
  total: number;
  containerRef: RefObject<HTMLDivElement | null>;
  /** Só empilha onde há espaço vertical de sobra (desktop). */
  stack: boolean;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const start = index / total;
  const scale = useTransform(scrollYProgress, [start, 1], [1, 0.9]);
  /**
   * O cartão que recua escurece por uma camada opaca *dentro* dele — não por
   * `opacity`. Baixar a opacidade do cartão inteiro deixaria o cartão de
   * baixo aparecer através dele e o texto ficaria ilegível, sobreposto.
   */
  const dim = useTransform(scrollYProgress, [start, 1], [0, 0.62]);

  return (
    <div
      // O empilhamento só existe onde há espaço vertical de sobra. No mobile
      // os cartões são mais altos que a tela — empilhar viraria armadilha.
      className="mb-6 lg:sticky lg:mb-10"
      style={{ top: `calc(6rem + ${index * 1.15}rem)` }}
    >
      <motion.div
        style={reduce || !stack ? undefined : { scale }}
        className="origin-top"
      >
        <SpotlightCard
          as="article"
          className="border-gradient overflow-hidden rounded-[1.75rem] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.95)]"
        >
          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-14">
            {/* halo */}
            <div
              aria-hidden
              className="halo pointer-events-none absolute -right-32 -top-40 size-[30rem] opacity-30 blur-3xl"
            />

            {/* camada que escurece o cartão conforme ele recua na pilha */}
            {stack && !reduce && (
              <motion.div
                aria-hidden
                style={{ opacity: dim }}
                className="pointer-events-none absolute inset-0 z-20 bg-ink"
              />
            )}

            {/* Coluna esquerda */}
            <div className="relative">
              <div className="flex items-center gap-4">
                <span className="text-eyebrow text-brand-soft/70">
                  {service.index}
                </span>
                <span aria-hidden className="h-px w-10 bg-chalk/15" />
                <h3 className="text-eyebrow text-fog">{service.name}</h3>
              </div>

              <p className="text-title mt-6 max-w-[24ch] text-balance">
                {service.promise}
              </p>

              <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-fog">
                {service.description}
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-brand-soft/25 bg-brand/[0.09] py-2 pl-3 pr-4">
                <svg
                  viewBox="0 0 14 14"
                  className="size-3.5 text-brand-soft"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M7 11.5V2.5M3 6.5l4-4 4 4" />
                </svg>
                <span className="text-[0.8125rem] text-brand-soft">
                  {service.outcome}
                </span>
              </div>
            </div>

            {/* Coluna direita */}
            <div className="relative flex flex-col justify-between gap-8">
              <div className="pointer-events-none absolute -top-6 right-0 hidden size-32 opacity-70 lg:block">
                <ServiceGlyph id={service.id} />
              </div>

              <ul className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2 lg:mt-24 lg:grid-cols-1">
                {service.deliverables.map((d) => (
                  <li
                    key={d}
                    className="group/item flex items-center gap-3 border-b border-chalk/6 py-2.5 text-[0.875rem] text-fog transition-colors duration-300 last:border-0 hover:text-chalk"
                  >
                    <span
                      aria-hidden
                      className="size-1 rounded-full bg-brand-soft/50 transition-all duration-500 ease-versa group-hover/item:w-3 group-hover/item:bg-brand-soft"
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}

export function ServicesCta() {
  return (
    <div className="shell mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Button href={SITE.contact.whatsapp} external variant="ghost" size="lg">
        Descobrir por onde começar
        <ArrowIcon />
      </Button>
      <p className="max-w-[34ch] text-[0.8125rem] leading-relaxed text-fog-dim">
        Na primeira conversa a gente diz qual frente resolve o seu gargalo —
        mesmo que seja só uma delas.
      </p>
    </div>
  );
}
