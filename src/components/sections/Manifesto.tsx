import { Eyebrow } from "@/components/layout/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ScrubWords } from "@/components/ui/SplitText";

const WITHOUT = [
  "Impulsionar no automático e torcer",
  "Site bonito que ninguém contata",
  "Post sem objetivo e sem funil",
  "Relatório cheio de métrica de vaidade",
];

const WITH = [
  "Funil desenhado antes do primeiro real investido",
  "Site construído para virar conversa",
  "Cada peça com um papel na jornada",
  "Número que responde: quanto voltou?",
];

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="halo pointer-events-none absolute -left-40 top-1/3 size-[36rem] opacity-25 blur-[80px]"
      />

      <div className="shell relative">
        <Reveal y={16} blur={false}>
          <Eyebrow index="01">O diagnóstico</Eyebrow>
        </Reveal>

        <ScrubWords
          className="text-statement mt-8 max-w-[42ch] text-chalk"
          text="Você posta, impulsiona e investe. E no fim do mês não sabe quanto voltou. O problema não é o seu negócio — é anunciar sem estratégia, num site que não converte, com uma marca que não convence."
          highlight={["estratégia", "converte", "convence"]}
        />

        {/* Comparativo */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-chalk/8 bg-chalk/8 md:mt-20 md:grid-cols-2">
          <div className="bg-ink-2 p-7 sm:p-9">
            <p className="text-eyebrow text-fog-dim">Sem estratégia</p>
            <RevealGroup as="ul" className="mt-6 flex flex-col gap-4">
              {WITHOUT.map((item) => (
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

          <div className="relative overflow-hidden bg-ink-3 p-7 sm:p-9">
            <div
              aria-hidden
              className="halo pointer-events-none absolute -right-24 -top-24 size-72 opacity-40 blur-3xl"
            />
            <p className="text-eyebrow relative text-brand-soft">
              Com a Versa
            </p>
            <RevealGroup as="ul" className="relative mt-6 flex flex-col gap-4">
              {WITH.map((item) => (
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
        </div>
      </div>
    </section>
  );
}
