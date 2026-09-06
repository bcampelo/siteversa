import { VersaMark } from "@/components/brand/VersaMark";
import { Eyebrow } from "@/components/layout/SectionHeading";
import { ArrowIcon, Button, WhatsAppIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { SITE, DIAGNOSTICO_HREF } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

const REASSURANCE = [
  { label: "Diagnóstico", value: "Grátis, em 2 minutos" },
  { label: "Retorno", value: "Em até 24h úteis" },
  { label: "Proposta", value: "Escopo, prazo e preço fechados" },
];

export function FinalCta() {
  return (
    <section
      id="contato"
      className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36"
    >
      {/* fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="halo absolute left-1/2 top-1/2 size-[54rem] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 animate-breathe blur-[100px]" />
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 w-[34rem] max-w-[110vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.045]">
          <VersaMark variant="mono" className="text-chalk" />
        </div>
      </div>

      <div className="shell relative">
        <div className="flex flex-col items-center text-center">
          <Reveal y={16} blur={false}>
            <Eyebrow index="11">Próximo passo</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="text-hero mt-8 max-w-[22ch] text-balance">
              Você não precisa contratar nada para{" "}
              <span className="font-editorial italic font-normal text-gradient">
                descobrir o que está travando.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-lede mx-auto mt-8 max-w-[52ch] text-fog">
              Seis perguntas, dois minutos, e a nossa leitura do seu caso. Se
              a resposta for que você ainda não deveria contratar ninguém, é
              isso que a gente vai dizer.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            {/*
              Dois níveis de compromisso, não dois canais para o mesmo
              compromisso. Antes o rodapé oferecia WhatsApp e e-mail, que
              custam a mesma coisa para quem está decidindo.
            */}
            <div className="mt-11 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                href={DIAGNOSTICO_HREF}
                size="lg"
                section="cta-final"
                ctaLabel="Quero uma análise do meu caso"
              >
                Quero uma análise do meu caso
                <ArrowIcon />
              </Button>
              <Button
                href={whatsappUrl("cta-final")}
                external
                variant="ghost"
                size="lg"
                section="cta-final"
                ctaLabel="WhatsApp"
              >
                <WhatsAppIcon />
                Falar agora no WhatsApp
              </Button>
            </div>

            <p className="mt-6 text-[0.8125rem] text-fog-dim">
              Prefere e-mail?{" "}
              <TrackedLink
                href={`mailto:${SITE.contact.email}?subject=Projeto%20com%20a%20Versa`}
                section="cta-final"
                ctaLabel="E-mail"
                className="link-underline text-chalk"
              >
                {SITE.contact.email}
              </TrackedLink>
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <dl className="mt-16 grid w-full max-w-3xl gap-px overflow-hidden rounded-2xl border border-chalk/8 bg-chalk/8 sm:grid-cols-3">
              {REASSURANCE.map((r) => (
                <div key={r.label} className="bg-ink-2/80 px-5 py-6 backdrop-blur-sm">
                  <dt className="text-eyebrow text-fog-dim">{r.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] text-chalk">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
