import { Button } from "@/components/ui/Button";
import { DrawGroup, RevealTitle } from "@/components/v3/ink";
import { SOBRE } from "@/lib/content-v3";
import { whatsappUrl } from "@/lib/whatsapp";

const { closing } = SOBRE;

/** Fechamento do /sobre: a promessa, o botão e a assinatura se escrevendo. */
export function SobreFechamento() {
  return (
    // Padding superior 135px (não 144), pelo mesmo motivo do SobreBio
    <section id="fechamento" className="overflow-clip py-24 tab:pt-[135px] tab:pb-36">
      <DrawGroup className="wrap flex flex-col items-center text-center">
        <RevealTitle className="font-display text-[min(48px,calc((100vw-48px)/7))] leading-[0.94] font-medium tracking-[-0.05em] text-balance [overflow-wrap:break-word] tab:text-[80px] desk:text-[104px]">
          {closing.title[0]}
          <br />
          {closing.title[1]}
        </RevealTitle>

        <p className="mt-8 mb-6 text-[17px] leading-[1.55] text-pretty text-fog tab:mt-10">
          {closing.text}
        </p>

        <Button
          href={whatsappUrl("sobre")}
          external
          section="sobre"
          ctaLabel={closing.cta}
        >
          {closing.cta}
        </Button>

        {/* Só a assinatura gira: write-in anima clip-path, não transform */}
        <div className="write-in mt-10 -rotate-4 font-hand text-[64px] leading-none text-accent">
          {closing.sign}
        </div>
      </DrawGroup>
    </section>
  );
}
