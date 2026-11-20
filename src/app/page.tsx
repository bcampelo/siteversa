import { InkTrail } from "@/components/v3/ink";
import { Como } from "@/components/v3/sections/Como";
import { Fechamento } from "@/components/v3/sections/Fechamento";
import { Hero } from "@/components/v3/sections/Hero";
import { MaisPecas } from "@/components/v3/sections/MaisPecas";
import { Servicos } from "@/components/v3/sections/Servicos";
import { Trabalhos } from "@/components/v3/sections/Trabalhos";

/**
 * A home da v3: uma conversa em seis passos.
 * Hero promete, Servicos mostra o rascunho virando peça, Trabalhos prova com
 * três clientes de Rio Branco, MaisPecas mostra artes e animações de outros
 * projetos, Como mostra o roadmap das seis etapas, Fechamento chama para o
 * WhatsApp e leva ao /sobre. O InkTrail é o rastro de tinta do mouse.
 *
 * As 14 seções anteriores (src/components/sections) continuam no
 * repositório, só deixaram de ser importadas daqui.
 */
export default function Home() {
  return (
    <>
      <InkTrail />
      <Hero />
      <Servicos />
      <Trabalhos />
      <MaisPecas />
      <Como />
      <Fechamento />
    </>
  );
}
