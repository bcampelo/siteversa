import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ferramentas gratuitas",
  description:
    "Calculadoras e diagnósticos gratuitos da Versa. Sem cadastro para ver o resultado.",
  alternates: { canonical: "/ferramentas" },
};

/**
 * Índice de ferramentas.
 *
 * Existe desde a primeira ferramenta, e não a partir da terceira, porque é
 * esta página que vira destino de link e de compartilhamento. Cada item novo
 * entra aqui e no sitemap, e cada um é uma porta de entrada de busca que o
 * site de página única não tinha.
 */
type Ferramenta = {
  href: string;
  nome: string;
  descricao: string;
  tempo: string;
  disponivel: boolean;
};

const FERRAMENTAS: Ferramenta[] = [
  {
    href: "/ferramentas/verba-minima",
    nome: "Verba mínima viável",
    descricao:
      "Quanto você precisa investir por dia para a plataforma conseguir otimizar a sua campanha. Com a conta aberta.",
    tempo: "1 minuto",
    disponivel: true,
  },
  {
    href: "/diagnostico",
    nome: "Diagnóstico do seu marketing",
    descricao:
      "Seis perguntas e a nossa leitura do que está travando o seu resultado, inclusive quando a resposta é não contratar ninguém.",
    tempo: "2 minutos",
    disponivel: true,
  },
];

export default function FerramentasPage() {
  return (
    <section className="relative overflow-hidden pb-28 pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_45%_at_50%_15%,black,transparent)]" />
        <div className="halo absolute left-1/2 top-0 size-[42rem] max-w-[150vw] -translate-x-1/2 blur-[90px]" />
      </div>

      <div className="shell relative">
        <div className="max-w-3xl">
          <Link
            href="/"
            className="text-eyebrow text-fog-dim transition-colors duration-300 hover:text-chalk"
          >
            ← {SITE.name}
          </Link>
          <h1 className="text-display mt-7 max-w-[18ch] text-balance">
            Ferramentas que{" "}
            <span className="text-gradient">entregam antes de pedir.</span>
          </h1>
          <p className="text-lede mt-6 max-w-[54ch] text-fog">
            Construímos essas ferramentas para uso interno e resolvemos abrir.
            Todas mostram o resultado antes de qualquer cadastro. Se servirem e
            você nunca falar com a gente, tudo bem.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {FERRAMENTAS.map((f) => (
            <li key={f.href}>
              <Link
                href={f.href}
                className="group/f flex h-full flex-col justify-between gap-8 rounded-3xl border border-chalk/8 bg-ink-2 p-7 transition-colors duration-500 hover:border-brand-soft/30 sm:p-8"
              >
                <div>
                  <p className="text-eyebrow text-brand-soft/70">{f.tempo}</p>
                  <h2 className="text-title mt-4">{f.nome}</h2>
                  <p className="mt-3 max-w-[42ch] text-[0.875rem] leading-relaxed text-fog">
                    {f.descricao}
                  </p>
                </div>
                <span className="grid size-11 place-items-center rounded-full border border-chalk/12 text-chalk transition-all duration-500 ease-versa group-hover/f:border-transparent group-hover/f:bg-chalk group-hover/f:text-ink">
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
