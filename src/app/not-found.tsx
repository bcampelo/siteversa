import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { DIAGNOSTICO_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Uma 404 padrão é um beco sem saída, e beco sem saída em site que recebe
 * tráfego pago é verba jogada fora. Esta página assume que quem chegou aqui
 * errou o caminho, não errou a intenção, e oferece os dois destinos que
 * resolvem quase tudo.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]" />
        <div className="halo absolute left-1/2 top-1/3 size-[40rem] max-w-[150vw] -translate-x-1/2 blur-[90px]" />
      </div>

      <div className="shell relative">
        <div className="max-w-2xl">
          <p className="font-mono text-eyebrow text-brand-soft/70">erro 404</p>
          <h1 className="text-hero mt-6 max-w-[16ch] text-balance">
            Esta página{" "}
            <span className="text-gradient">não existe.</span>
          </h1>
          <p className="text-lede mt-7 max-w-[46ch] text-fog">
            Ou saiu do ar, ou o link veio torto. Nenhum dos dois é culpa sua.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={DIAGNOSTICO_HREF}
              size="lg"
              section="404"
              ctaLabel="Diagnóstico"
            >
              Rodar o diagnóstico gratuito
              <ArrowIcon />
            </Button>
            <Button
              href="/"
              variant="ghost"
              size="lg"
              section="404"
              ctaLabel="Início"
            >
              Voltar para o início
            </Button>
          </div>

          <p className="mt-8 text-[0.8125rem] text-fog-dim">
            Procurando alguma ferramenta?{" "}
            <Link href="/ferramentas" className="link-underline text-chalk">
              Estão todas aqui
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
