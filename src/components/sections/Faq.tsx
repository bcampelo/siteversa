"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              index="07"
              eyebrow="Perguntas frequentes"
              title={
                <>
                  Respostas diretas,{" "}
                  <span className="text-gradient">sem enrolação.</span>
                </>
              }
            />
            <Reveal delay={0.12}>
              <p className="mt-8 text-[0.875rem] leading-relaxed text-fog">
                Ficou alguma dúvida que não está aqui? Manda no WhatsApp — a
                gente responde de verdade, não com robô.
              </p>
              <a
                href={SITE.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-3 inline-block text-[0.875rem] text-brand-soft"
              >
                {SITE.contact.whatsappDisplay}
              </a>
            </Reveal>
          </div>

          <ul className="flex flex-col">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal as="li" key={item.q} delay={i * 0.04}>
                  <div className="border-b border-chalk/8">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-button-${i}`}
                        className="group/q flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span className="text-subtitle max-w-[38ch] text-balance transition-colors duration-400 group-hover/q:text-brand-soft">
                          {item.q}
                        </span>
                        <span
                          aria-hidden
                          className="relative mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-chalk/12 transition-colors duration-400 group-hover/q:border-brand-soft/40"
                        >
                          <span className="absolute h-px w-3 bg-chalk" />
                          <span
                            className="absolute h-3 w-px bg-chalk transition-transform duration-500 ease-versa"
                            style={{
                              transform: isOpen ? "scaleY(0)" : "scaleY(1)",
                            }}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-button-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                            opacity: { duration: 0.32 },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[62ch] pb-7 pr-10 text-[0.9375rem] leading-relaxed text-fog">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
