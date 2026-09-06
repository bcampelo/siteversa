"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { TECH_GROUPS } from "@/lib/content";

/* Código destacado à mão — controle total de cor, zero dependência. */
const CODE_LINES: { indent: number; parts: [string, string][] }[] = [
  { indent: 0, parts: [["c", "// versa/lead-router.ts"]] },
  {
    indent: 0,
    parts: [
      ["k", "export async function "],
      ["f", "routeLead"],
      ["p", "(lead: Lead) {"],
    ],
  },
  {
    indent: 1,
    parts: [
      ["k", "const "],
      ["v", "score"],
      ["p", " = "],
      ["k", "await "],
      ["f", "qualify"],
      ["p", "(lead);"],
      ["c", "   // triagem com IA"],
    ],
  },
  { indent: 0, parts: [["p", ""]] },
  {
    indent: 1,
    parts: [
      ["k", "if "],
      ["p", "(score >= "],
      ["n", "0.75"],
      ["p", ") {"],
    ],
  },
  {
    indent: 2,
    parts: [
      ["k", "await "],
      ["f", "notify"],
      ["p", "("],
      ["s", '"whatsapp"'],
      ["p", ", lead);"],
      ["c", "  // comercial na hora"],
    ],
  },
  {
    indent: 2,
    parts: [
      ["k", "return "],
      ["f", "track"],
      ["p", "("],
      ["s", '"lead.hot"'],
      ["p", ", lead);"],
    ],
  },
  { indent: 1, parts: [["p", "}"]] },
  { indent: 0, parts: [["p", ""]] },
  {
    indent: 1,
    parts: [
      ["k", "await "],
      ["f", "enqueue"],
      ["p", "("],
      ["s", '"nurture"'],
      ["p", ", lead);"],
      ["c", "   // remarketing"],
    ],
  },
  {
    indent: 1,
    parts: [
      ["k", "return "],
      ["f", "track"],
      ["p", "("],
      ["s", '"lead.warm"'],
      ["p", ", lead);"],
    ],
  },
  { indent: 0, parts: [["p", "}"]] },
];

const TOKEN: Record<string, string> = {
  c: "text-fog-dim/70 italic",
  k: "text-brand-soft",
  f: "text-[#8fd3ff]",
  s: "text-[#9be2b0]",
  n: "text-[#f0c987]",
  v: "text-chalk",
  p: "text-fog",
};

export function Tech() {
  const codeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(codeRef, { once: true, margin: "-18% 0px" });
  const reduce = useReducedMotion();

  return (
    <section id="tecnologia" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        aria-hidden
        className="halo pointer-events-none absolute right-0 top-1/4 size-[40rem] opacity-25 blur-[90px]"
      />

      <div className="shell relative">
        <SectionHeading
          index="09"
          eyebrow="Tecnologia"
          title={
            <>
              Design é o que você vê.{" "}
              <span className="text-gradient">Engenharia é o que sustenta.</span>
            </>
          }
          lede="Não somos uma agência que terceiriza código. O mesmo time que desenha as peças escreve o software — e isso muda o que conseguimos entregar."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/*
            `min-w-0` no item da grade não é detalhe de estilo, é correção de
            bug. Item de grid tem `min-width: auto` por padrão, então ele se
            recusa a encolher abaixo da largura do conteúdo. Como o conteúdo
            aqui é um bloco de código com linhas longas, a coluna esticava e
            a PÁGINA INTEIRA passava a rolar de lado no celular, mesmo com o
            `overflow-x-auto` no <pre>. O `overflow-x-auto` só funciona depois
            que o item aceita ser mais estreito que o conteúdo.
          */}
          <Reveal className="min-w-0">
            <div
              ref={codeRef}
              className="border-gradient overflow-hidden rounded-2xl shadow-[0_40px_120px_-70px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-2 border-b border-chalk/8 bg-ink-3/60 px-4 py-3">
                <span className="size-2.5 rounded-full bg-chalk/12" />
                <span className="size-2.5 rounded-full bg-chalk/12" />
                <span className="size-2.5 rounded-full bg-chalk/12" />
                <span className="ml-3 font-mono text-[0.6875rem] text-fog-dim">
                  lead-router.ts
                </span>
              </div>

              <pre className="overflow-x-auto p-5 font-mono text-[0.75rem] leading-[1.85] sm:text-[0.8125rem]">
                <code>
                  {CODE_LINES.map((line, i) => (
                    <motion.span
                      key={i}
                      className="block whitespace-pre"
                      initial={reduce ? undefined : { opacity: 0, x: -8 }}
                      animate={
                        reduce || inView ? { opacity: 1, x: 0 } : undefined
                      }
                      transition={{
                        duration: 0.4,
                        delay: 0.12 + i * 0.075,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {"  ".repeat(line.indent)}
                      {line.parts.map(([token, text], j) => (
                        <span key={j} className={TOKEN[token]}>
                          {text}
                        </span>
                      ))}
                      {i === CODE_LINES.length - 1 && (
                        <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-[2px] animate-caret bg-brand-soft" />
                      )}
                    </motion.span>
                  ))}
                </code>
              </pre>
            </div>

            <p className="mt-5 max-w-[46ch] text-[0.8125rem] leading-relaxed text-fog-dim">
              Exemplo real do tipo de automação que colocamos por trás de uma
              campanha: lead qualificado por IA, comercial avisado na hora, o
              resto entrando em fluxo de remarketing. Ninguém precisa olhar
              planilha.
            </p>
          </Reveal>

          {/* ---- Stack ---- */}
          <div className="flex flex-col gap-8">
            {TECH_GROUPS.map((group, gi) => (
              <Reveal key={group.label} delay={gi * 0.06}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-eyebrow text-brand-soft/70">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-eyebrow text-fog">{group.label}</h3>
                    <span aria-hidden className="h-px flex-1 bg-chalk/8" />
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item.name} className="group/tech relative">
                        <span className="flex cursor-default items-center gap-2 rounded-xl border border-chalk/10 bg-ink-2 px-3.5 py-2.5 text-[0.875rem] text-chalk/90 transition-all duration-500 ease-versa group-hover/tech:-translate-y-0.5 group-hover/tech:border-brand-soft/35 group-hover/tech:bg-ink-3">
                          <span
                            aria-hidden
                            className="size-1.5 rounded-full bg-brand-soft/40 transition-colors duration-500 group-hover/tech:bg-brand-soft"
                          />
                          {item.name}
                        </span>
                        {/* tooltip */}
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 w-52 -translate-x-1/2 translate-y-1 rounded-lg border border-chalk/10 bg-ink px-3 py-2 text-[0.75rem] leading-snug text-fog opacity-0 shadow-[0_20px_50px_-20px_rgba(0,0,0,1)] transition-all duration-400 ease-versa group-hover/tech:translate-y-0 group-hover/tech:opacity-100"
                        >
                          {item.use}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* faixa de reforço */}
      <div className="mt-20 border-y border-chalk/8 py-5">
        <Marquee speed={52}>
          {TECH_GROUPS.flatMap((g) => g.items).map((item) => (
            <span
              key={item.name}
              className="flex items-center gap-6 whitespace-nowrap px-6 text-eyebrow text-fog-dim"
            >
              {item.name}
              <span aria-hidden className="size-1 rounded-full bg-brand/50" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
