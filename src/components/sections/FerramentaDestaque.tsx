import Link from "next/link";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { VerbaMinima } from "@/components/ferramentas/VerbaMinima";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Ferramenta em destaque na home.
 *
 * Colocada logo depois do diagnóstico do problema e antes de qualquer
 * apresentação de serviço, de propósito. A ordem importa: o visitante acabou
 * de se reconhecer numa dor e a próxima coisa que acontece é o site
 * resolver um pedaço dela de graça, na tela, sem pedir nada.
 *
 * É também a única forma honesta de provar o posicionamento. Dizer "somos
 * uma empresa de tecnologia" e listar frameworks não prova nada. Rodar uma
 * ferramenta que a agência do lado não conseguiria construir prova.
 */
export function FerramentaDestaque() {
  return (
    <section
      id="ferramenta"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="halo pointer-events-none absolute -right-40 top-1/4 size-[34rem] opacity-20 blur-[80px]"
      />

      <div className="shell relative">
        <SectionHeading
          index="02"
          eyebrow="Ferramenta gratuita"
          title={
            <>
              Antes de vender qualquer coisa,{" "}
              <span className="text-gradient">um número.</span>
            </>
          }
          lede="A plataforma precisa de um volume mínimo de eventos para conseguir aprender quem é o seu comprador. Abaixo disso o resultado oscila e ninguém explica por quê. Mexa nos controles e veja a sua conta."
        />

        <div className="mt-12">
          <VerbaMinima compacto />
        </div>

        <Reveal delay={0.06}>
          <p className="mt-8 text-[0.8125rem] text-fog-dim">
            Quer entender de onde sai essa conta?{" "}
            <Link
              href="/ferramentas/verba-minima"
              className="link-underline text-chalk"
            >
              Ver a explicação completa
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
