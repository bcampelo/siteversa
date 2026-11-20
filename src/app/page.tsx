import { InkTrail } from "@/components/v3/ink";
import { Como } from "@/components/v3/sections/Como";
import { Fechamento } from "@/components/v3/sections/Fechamento";
import { Hero } from "@/components/v3/sections/Hero";
import { MaisPecas } from "@/components/v3/sections/MaisPecas";
import { Servicos } from "@/components/v3/sections/Servicos";
import { Trabalhos } from "@/components/v3/sections/Trabalhos";
import { SobreBio } from "@/components/v3/sobre/SobreBio";
import { SobreHero } from "@/components/v3/sobre/SobreHero";
import "@/components/v3/sobre/sobre.css";

/**
 * A home da v3: uma landing page única, em sete passos.
 * Hero promete, Servicos mostra o rascunho virando peça, Trabalhos prova com
 * três clientes de Rio Branco, MaisPecas mostra artes e animações de outros
 * projetos, Como mostra o roadmap das seis etapas, Sobre apresenta quem faz o
 * trabalho e Fechamento chama para o WhatsApp. O InkTrail é o rastro de tinta
 * do mouse.
 *
 * O Sobre era a rota /sobre, que hoje redireciona para /#sobre. Ele não tem
 * fechamento próprio: o Fechamento da home já é o chamado final.
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
      <div id="sobre">
        <SobreHero />
        <SobreBio />
      </div>
      <Fechamento />
    </>
  );
}
