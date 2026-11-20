import type { Metadata } from "next";
import Link from "next/link";
import { SERVICOS_PAGINAS } from "@/lib/servicos";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Serviços em Rio Branco, Acre",
  description:
    "Criação de sites, sistemas sob medida, tráfego pago e placa NFC de avaliação para negócios de Rio Branco e do Acre.",
  alternates: { canonical: "/servicos" },
};

export default function ServicosPage() {
  return (
    <section className="relative overflow-hidden pb-28 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_45%_at_50%_15%,black,transparent)]" />
        <div className="halo absolute left-1/2 top-0 size-[42rem] max-w-[150vw] -translate-x-1/2 blur-[90px]" />
      </div>
      <div className="shell relative">
        <div className="max-w-3xl">
          <Link href="/" className="text-eyebrow text-fog-dim transition-colors duration-300 hover:text-chalk">
            ← {SITE.name}
          </Link>
          <h1 className="text-display mt-7 max-w-[18ch] text-balance">
            Tecnologia feita no Acre, para o jeito que o negócio daqui{" "}
            <span className="text-gradient">trabalha.</span>
          </h1>
          <p className="text-lede mt-6 max-w-[54ch] text-fog">
            Sites, sistemas e anúncios para empresas de Rio Branco e do Acre. Quem conversa com você é quem faz o trabalho.
          </p>
        </div>
        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {SERVICOS_PAGINAS.map((s) => (
            <li key={s.slug} className="min-w-0">
              <Link
                href={`/servicos/${s.slug}`}
                className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-chalk/8 bg-ink-2 p-7 transition-colors duration-500 hover:border-brand-soft/30 sm:p-8"
              >
                <div>
                  <p className="text-eyebrow text-brand-soft/70">{s.nome}</p>
                  <h2 className="text-title mt-4">
                    {s.h1} {s.h1Destaque}
                  </h2>
                  <p className="mt-3 max-w-[46ch] text-[0.875rem] leading-relaxed text-fog">{s.seoDescription}</p>
                </div>
                <span className="text-[0.875rem] text-chalk">Ver como funciona →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
