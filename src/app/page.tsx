import { Commitments } from "@/components/sections/Commitments";
import { Differentials } from "@/components/sections/Differentials";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Process } from "@/components/sections/Process";
import { Services, ServicesCta } from "@/components/sections/Services";
import { Tech } from "@/components/sections/Tech";
import { Work } from "@/components/sections/Work";

/**
 * Ordem das seções pensada como narrativa, não como catálogo:
 * impacto → dor → solução → prova de método → prova de trabalho →
 * prova técnica → compromisso → objeções → convite.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <ServicesCta />
      <Differentials />
      <Process />
      <Work />
      <Tech />
      <Commitments />
      <Faq />
      <FinalCta />
    </>
  );
}
