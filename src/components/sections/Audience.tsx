import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AUDIENCE } from "@/lib/content";

/**
 * Para quem é e para quem não é.
 *
 * A seção que o site não tinha e que mais muda a qualidade do lead.
 *
 * Dizer para quem você não serve parece perder venda e faz o contrário:
 * quem se encaixa relaxa ao ver que existe critério, e quem não se encaixa
 * sai antes de consumir o tempo do comercial. Numa empresa pequena, o tempo
 * de quem executa é o recurso mais caro que existe, e uma reunião com lead
 * errado custa mais do que dez visitas perdidas.
 */
export function Audience() {
  return (
    <section id="para-quem" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Critério"
          title={
            <>
              A gente não serve{" "}
              <span className="text-gradient">todo mundo.</span>
            </>
          }
          lede="Preferimos dizer isso agora do que na terceira reunião. Se você se reconhecer na coluna da direita, provavelmente existe alguém melhor para o seu momento, e a gente indica."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-chalk/8 bg-chalk/8 md:grid-cols-2">
          <div className="relative overflow-hidden bg-ink-3 p-7 sm:p-9">
            <div
              aria-hidden
              className="halo pointer-events-none absolute -left-24 -top-24 size-72 opacity-40 blur-3xl"
            />
            <Reveal y={12} blur={false}>
              <p className="text-eyebrow relative text-brand-soft">
                {AUDIENCE.fit.titulo}
              </p>
            </Reveal>
            <RevealGroup as="ul" className="relative mt-6 flex flex-col gap-4">
              {AUDIENCE.fit.itens.map((item) => (
                <RevealItem
                  as="li"
                  key={item}
                  className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-chalk"
                >
                  <svg
                    viewBox="0 0 14 14"
                    className="mt-1 size-3.5 shrink-0 text-brand-soft"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2.5 7.4 5.5 10.5 11.5 3.8" />
                  </svg>
                  <span>{item}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="bg-ink-2 p-7 sm:p-9">
            <Reveal y={12} blur={false}>
              <p className="text-eyebrow text-fog-dim">
                {AUDIENCE.notFit.titulo}
              </p>
            </Reveal>
            <RevealGroup as="ul" className="mt-6 flex flex-col gap-4">
              {AUDIENCE.notFit.itens.map((item) => (
                <RevealItem
                  as="li"
                  key={item}
                  className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-fog-dim"
                >
                  <svg
                    viewBox="0 0 14 14"
                    className="mt-1 size-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
                  </svg>
                  <span>{item}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
