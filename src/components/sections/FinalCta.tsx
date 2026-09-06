import { VersaMark } from "@/components/brand/VersaMark";
import { Eyebrow } from "@/components/layout/SectionHeading";
import { ArrowIcon, Button, WhatsAppIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

const REASSURANCE = [
  { label: "Primeira conversa", value: "Gratuita e sem script" },
  { label: "Retorno", value: "Em até 24h úteis" },
  { label: "Proposta", value: "Escopo e prazo fechados" },
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
            <Eyebrow index="08">Próximo passo</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="text-hero mt-8 max-w-[20ch] text-balance">
              A próxima fase da sua marca começa com{" "}
              <span className="font-editorial italic font-normal text-gradient">
                uma conversa.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-lede mx-auto mt-8 max-w-[52ch] text-fog">
              Sem compromisso e sem script de vendas. Você conta o cenário, a
              gente diz o que faria — e se somos, ou não, a escolha certa para
              o seu momento.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-11 flex flex-col items-center gap-3 sm:flex-row">
              <Button href={SITE.contact.whatsapp} external size="lg">
                <WhatsAppIcon />
                Chamar no WhatsApp
                <ArrowIcon />
              </Button>
              <Button
                href={`mailto:${SITE.contact.email}?subject=Projeto%20com%20a%20Versa`}
                variant="ghost"
                size="lg"
              >
                Enviar um e-mail
              </Button>
            </div>
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
