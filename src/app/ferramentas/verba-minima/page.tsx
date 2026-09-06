import type { Metadata } from "next";
import Link from "next/link";
import { VerbaMinima } from "@/components/ferramentas/VerbaMinima";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Calculadora de verba mínima viável para anúncios",
  description:
    "Descubra quanto você precisa investir por dia para a Meta conseguir otimizar a sua campanha. Grátis, sem cadastro, com a conta aberta.",
  alternates: { canonical: "/ferramentas/verba-minima" },
  openGraph: {
    title: "Sua verba de anúncio é suficiente? · Versa",
    description:
      "A conta que quase ninguém faz antes de subir campanha. Grátis e sem cadastro.",
  },
};

const ld = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de verba mínima viável",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE.url}/ferramentas/verba-minima`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
};

export default function VerbaMinimaPage() {
  return (
    <section className="relative overflow-hidden pb-28 pt-32 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_45%_at_50%_15%,black,transparent)]" />
        <div className="halo absolute left-1/2 top-0 size-[44rem] max-w-[150vw] -translate-x-1/2 blur-[90px]" />
      </div>

      <div className="shell relative">
        <div className="max-w-3xl">
          <Link
            href="/ferramentas"
            className="text-eyebrow text-fog-dim transition-colors duration-300 hover:text-chalk"
          >
            ← Ferramentas
          </Link>

          <h1 className="text-display mt-7 max-w-[20ch] text-balance">
            A sua verba de anúncio{" "}
            <span className="text-gradient">é suficiente?</span>
          </h1>
          <p className="text-lede mt-6 max-w-[54ch] text-fog">
            A plataforma precisa de um volume mínimo de eventos para conseguir
            aprender quem é o seu comprador. Abaixo desse volume o resultado
            oscila e ninguém consegue explicar por quê. Aqui está a conta.
          </p>
        </div>

        <div className="mt-14">
          <VerbaMinima />
        </div>

        <div className="mt-16 max-w-[68ch] border-t border-chalk/8 pt-10">
          <h2 className="text-subtitle">Por que 50 eventos em 7 dias</h2>
          <div className="mt-5 flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-fog">
            <p>
              O algoritmo da Meta trabalha por aprendizado. Ele precisa de
              exemplos suficientes de quem converteu para conseguir procurar
              gente parecida. O número que a própria plataforma usa como
              referência é de aproximadamente 50 eventos de otimização por
              conjunto de anúncios a cada 7 dias.
            </p>
            <p>
              Abaixo disso o conjunto fica no estado de aprendizado limitado.
              Na prática isso significa entrega instável, custo por resultado
              subindo e descendo sem motivo aparente, e impossibilidade de
              saber se um criativo é ruim ou se foi só falta de volume.
            </p>
            <p>
              É por isso que quase toda metodologia que você lê na internet
              não funciona em conta pequena: ela foi escrita assumindo verba
              10 a 50 vezes maior. Operar com pouca verba é possível, mas
              exige trocar o conjunto de regras, não trocar o criativo.
            </p>
            <p className="text-fog-dim">
              Esta calculadora usa a referência pública de 50 eventos por
              conjunto a cada 7 dias e as suas próprias margens. Ela não
              acessa a sua conta de anúncios e não substitui a leitura dos
              seus dados reais.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
