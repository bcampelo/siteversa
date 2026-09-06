import { SectionHeading } from "@/components/layout/SectionHeading";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { INVESTIMENTO } from "@/lib/content";
import { DIAGNOSTICO_HREF } from "@/lib/site";

/**
 * Faixas de investimento.
 *
 * O site inteiro respondia "depende" e mandava a pessoa para o WhatsApp.
 * Honesto, mas caro: quem não sabe se cabe no bolso não chama, e quem chama
 * só para perguntar preço consome atendimento sem chance de fechar.
 *
 * Estas são faixas de ancoragem, não tabela. O texto diz isso em voz alta,
 * porque prometer preço fechado sem escopo seria a mentira oposta.
 */
export function Investimento() {
  return (
    <section id="investimento" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index="08"
          eyebrow="Investimento"
          title={
            <>
              Quanto custa,{" "}
              <span className="text-gradient">antes de você perguntar.</span>
            </>
          }
          lede="Não é tabela fechada, porque escopo diferente custa diferente. É a faixa real em que os nossos projetos começam, para você saber se faz sentido continuar lendo."
        />

        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-2">
          {INVESTIMENTO.map((f) => (
            <RevealItem key={f.servico}>
              <article className="flex h-full flex-col rounded-3xl border border-chalk/8 bg-ink-2 p-7 transition-colors duration-500 hover:border-brand-soft/25 sm:p-8">
                <p className="text-eyebrow text-fog-dim">{f.servico}</p>

                <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[0.8125rem] text-fog">a partir de</span>
                  <span className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold leading-none tracking-[-0.04em] text-gradient">
                    {f.entrada}
                  </span>
                  <span className="text-[0.8125rem] text-fog">{f.unidade}</span>
                </div>

                <p className="mt-3 text-[0.8125rem] text-fog-dim">
                  Prazo típico: {f.prazo}
                </p>

                <ul className="mt-7 flex flex-col gap-2.5 border-t border-chalk/8 pt-6">
                  {f.inclui.map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-fog"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-brand-soft/60"
                      />
                      {i}
                    </li>
                  ))}
                </ul>

                {f.nota && (
                  <p className="mt-6 rounded-xl border border-chalk/8 bg-ink-3 p-4 text-[0.75rem] leading-relaxed text-fog-dim">
                    {f.nota}
                  </p>
                )}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button
              href={DIAGNOSTICO_HREF}
              variant="ghost"
              size="lg"
              section="investimento"
              ctaLabel="Ver o que o meu caso pediria"
            >
              Ver o que o meu caso pediria
              <ArrowIcon />
            </Button>
            <p className="max-w-[42ch] text-[0.8125rem] leading-relaxed text-fog-dim">
              A proposta final sai com escopo, prazo e investimento fechados,
              depois de entender o seu cenário. Sem letra miúda e sem cobrança
              que aparece no meio do projeto.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
