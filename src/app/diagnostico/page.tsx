import type { Metadata } from "next";
import Link from "next/link";
import { DiagnosticoFlow } from "@/components/diagnostico/DiagnosticoFlow";

export const metadata: Metadata = {
  title: "Diagnóstico gratuito",
  description:
    "Seis perguntas e uma leitura honesta do que está travando o seu marketing. Sem ligação de vendas e sem compromisso.",
  alternates: { canonical: "/diagnostico" },
  openGraph: {
    title: "Diagnóstico gratuito · Versa",
    description:
      "Seis perguntas e uma leitura honesta do que está travando o seu marketing.",
  },
};

export default function DiagnosticoPage() {
  return (
    <section className="relative min-h-svh overflow-hidden pb-28 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_50%_at_50%_20%,black,transparent)]" />
        <div className="halo absolute left-1/2 top-0 size-[46rem] max-w-[150vw] -translate-x-1/2 blur-[90px]" />
      </div>

      <div className="shell relative">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="text-eyebrow text-fog-dim transition-colors duration-300 hover:text-chalk"
          >
            ← Versa
          </Link>

          <h1 className="text-display mt-7 max-w-[18ch] text-balance">
            Seis perguntas.{" "}
            <span className="text-gradient">Uma resposta honesta.</span>
          </h1>
          <p className="text-lede mt-6 max-w-[50ch] text-fog">
            Leva menos de dois minutos. No fim você recebe a nossa leitura do
            seu caso, inclusive quando a resposta é que você ainda não deveria
            contratar nada.
          </p>

          <div className="mt-14 border-t border-chalk/8 pt-14">
            <DiagnosticoFlow />
          </div>
        </div>
      </div>
    </section>
  );
}
