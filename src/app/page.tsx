import { Audience } from "@/components/sections/Audience";
import { Commitments } from "@/components/sections/Commitments";
import { Differentials } from "@/components/sections/Differentials";
import { Faq } from "@/components/sections/Faq";
import { FerramentaDestaque } from "@/components/sections/FerramentaDestaque";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Investimento } from "@/components/sections/Investimento";
import { Manifesto } from "@/components/sections/Manifesto";
import { Process } from "@/components/sections/Process";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Services, ServicesCta } from "@/components/sections/Services";
import { Tech } from "@/components/sections/Tech";
import { Work } from "@/components/sections/Work";

/**
 * Ordem das seções.
 *
 * A ordem anterior era uma narrativa bonita e longa demais para tráfego
 * frio: a prova, que é o argumento mais forte que existe, só aparecia na
 * sétima seção, depois de três telas de método. Quem paga por clique não
 * consegue esperar tanto.
 *
 * A ordem nova segue a sequência de uma conversa de venda que funciona:
 *
 *   promessa      Hero
 *   credibilidade ProofStrip     nomes reais antes de qualquer argumento
 *   dor           Manifesto
 *   entrega       FerramentaDestaque  valor antes de pedir qualquer coisa
 *   solução       Services
 *   critério      Audience       para quem é e para quem não é
 *   prova         Work           subiu quatro posições
 *   justificativa Differentials
 *   segurança     Process
 *   preço         Investimento
 *   capacidade    Tech
 *   padrão        Commitments
 *   objeção       Faq
 *   convite       FinalCta
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Manifesto />
      <FerramentaDestaque />
      <Services />
      <ServicesCta />
      <Audience />
      <Work />
      <Differentials />
      <Process />
      <Investimento />
      <Tech />
      <Commitments />
      <Faq />
      <FinalCta />
    </>
  );
}
