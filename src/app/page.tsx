import { Como } from "@/components/v3/sections/Como";
import { Fechamento } from "@/components/v3/sections/Fechamento";
import { Hero } from "@/components/v3/sections/Hero";
import { Servicos } from "@/components/v3/sections/Servicos";
import { Trabalhos } from "@/components/v3/sections/Trabalhos";

/**
 * A home da v3: uma conversa em cinco passos.
 * Hero promete, Servicos mostra o rascunho virando peça, Trabalhos prova com
 * três clientes de Rio Branco, Como explica quem atende, Fechamento chama
 * para o WhatsApp.
 *
 * As 14 seções anteriores (src/components/sections) continuam no
 * repositório, só deixaram de ser importadas daqui.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Servicos />
      <Trabalhos />
      <Como />
      <Fechamento />
    </>
  );
}
