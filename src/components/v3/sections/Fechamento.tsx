import { Button } from "@/components/ui/Button";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Burst, DrawGroup, Engraving, Hand, Parallax, RevealTitle } from "@/components/v3/ink";
import { CTA_LABEL, FECHAMENTO } from "@/lib/content-v3";
import { whatsappUrl } from "@/lib/whatsapp";

export function Fechamento() {
  return (
    // O id é o que o StickyCta observa para sumir
    <section id="fechamento" className="overflow-clip py-24 tab:py-36">
      <DrawGroup className="wrap relative flex min-h-[560px] flex-col items-center pt-12 pb-10 text-center tab:min-h-[660px] tab:pt-24 tab:pb-16">
        {/* No celular os raios escalam com a largura (2x o contêiner) e o centro desce até o busto */}
        <Burst
          viewBox="0 0 1200 660"
          cx={600}
          cy={330}
          r={300}
          n={96}
          min={20}
          max={200}
          seed={29}
          ring
          opacity={0.4}
          delay={0.2}
          dur={2.2}
          className="top-[-20px] left-1/2 -ml-[100%] h-auto w-[200%] tab:top-0 tab:-ml-[600px] tab:h-[660px] tab:w-[1200px]"
        />
        <Parallax>
          <Engraving
            src="/v3/busto-cta.webp"
            alt={FECHAMENTO.bustAlt}
            width={560}
            height={600}
            className="absolute top-6 left-1/2 -ml-[160px] h-[340px] w-[320px] opacity-40 tab:top-10 tab:-ml-[280px] tab:h-[600px] tab:w-[560px]"
          />
        </Parallax>

        <Hand
          as="p"
          delay={0.6}
          className="relative mt-6 mb-6 text-[26px] text-fog! tab:mt-10 tab:text-[34px]"
        >
          {FECHAMENTO.quote.latin}
          <small className="mt-1 block font-sans text-[14px]">
            {FECHAMENTO.quote.translation}
          </small>
        </Hand>

        <RevealTitle className="relative mt-6 font-display text-[min(56px,calc((100vw-48px)/6.3))] leading-[0.94] font-medium tracking-[-0.05em] text-balance [overflow-wrap:break-word] tab:text-[88px] desk:text-[120px]">
          {FECHAMENTO.title[0]}
          <br />
          {FECHAMENTO.title[1]}
        </RevealTitle>

        <p className="relative mt-8 mb-6 text-[17px] leading-[1.55] text-pretty text-fog tab:mt-10">
          {FECHAMENTO.text}
        </p>

        <Button
          href={whatsappUrl("cta-final")}
          external
          section="cta-final"
          ctaLabel={CTA_LABEL}
          className="relative"
        >
          {FECHAMENTO.cta}
        </Button>

        {/*
          A assinatura é o link para /sobre. O clip-path do .write-in corta o
          contorno de foco, então o link é a caixa de fora e o .write-in fica
          dentro, só com o texto. A rotação também fica no link.
          O evento `about_open` não existe em VersaEvent (analytics.ts não
          muda nesta rodada), então vai o mais próximo: cta_click.
        */}
        <TrackedLink
          href={FECHAMENTO.sign.href}
          section="cta-final"
          event="cta_click"
          ctaLabel={FECHAMENTO.sign.link}
          className="group relative mt-8 block -rotate-4 rounded-xl p-2"
        >
          <span className="write-in block font-hand text-[64px] leading-none text-accent">
            {FECHAMENTO.sign.name}
            <small className="mt-2 block font-sans text-[14px] text-fog group-hover:text-chalk">
              {FECHAMENTO.sign.link}
            </small>
          </span>
        </TrackedLink>
      </DrawGroup>
    </section>
  );
}
