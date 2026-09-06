"use client";

import { useEffect } from "react";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

/**
 * Fronteira de erro da aplicação.
 *
 * Tela branca com stack trace é o pior desfecho possível para uma visita
 * paga. Aqui o visitante vê algo com a cara do site, tem um botão para
 * tentar de novo e um caminho humano para chegar na gente mesmo com a
 * página quebrada.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[versa:error]", error);
    try {
      window.dataLayer?.push({
        event: "app_error",
        message: error.message,
        digest: error.digest,
      });
    } catch {
      /* medição não pode piorar um erro que já aconteceu */
    }
  }, [error]);

  return (
    <section className="relative flex min-h-svh items-center py-32">
      <div className="shell">
        <div className="max-w-xl">
          <p className="font-mono text-eyebrow text-brand-soft/70">
            alguma coisa quebrou
          </p>
          <h1 className="text-display mt-6 text-balance">
            Erro da nossa parte, não sua.
          </h1>
          <p className="text-lede mt-6 max-w-[44ch] text-fog">
            Já registramos o que aconteceu. Tentar de novo costuma resolver.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-[3.35rem] items-center justify-center gap-2.5 rounded-full bg-chalk px-7 text-base font-medium text-ink"
            >
              Tentar de novo
            </button>
            <Button
              href="/"
              variant="ghost"
              size="lg"
              section="erro"
              ctaLabel="Início"
            >
              Ir para o início
              <ArrowIcon />
            </Button>
          </div>

          <p className="mt-8 text-[0.8125rem] text-fog-dim">
            Se continuar, avise a gente em{" "}
            <a
              href={`mailto:${SITE.contact.email}`}
              className="link-underline text-chalk"
            >
              {SITE.contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
