"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { ArrowIcon, Button, WhatsAppIcon } from "@/components/ui/Button";
import { trackAdsConversion } from "@/lib/analytics";
import type { Diagnostico } from "@/lib/diagnostico";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Página de obrigado.
 *
 * Existe por dois motivos, nessa ordem de importância:
 *
 * 1. É onde a conversão vira contável. Sem uma URL própria depois do envio,
 *    não há como marcar conversão no Google Ads nem otimizar campanha por
 *    lead. Essa página é a diferença entre anunciar no escuro e anunciar
 *    com objetivo.
 * 2. É onde o lead quente encurta o caminho. Quem pontuou alto já sai daqui
 *    com o WhatsApp aberto e o contexto na mensagem, em vez de esperar
 *    alguém lembrar de responder.
 */
export function Obrigado() {
  /*
    O resumo vem do sessionStorage, que é um sistema externo ao React.
    `useSyncExternalStore` é a forma correta de ler um: no servidor devolve
    null, no cliente devolve o valor guardado, e não existe efeito que
    dispare um segundo render em cascata.
  */
  const raw = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem("versa:diagnostico");
      } catch {
        return null;
      }
    },
    () => null,
  );

  const dados = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { diag: Diagnostico; nome: string };
    } catch {
      return null;
    }
  }, [raw]);

  useEffect(() => {
    trackAdsConversion();
  }, []);

  const quente = dados?.diag.temperatura === "quente";
  const primeiroNome = dados?.nome?.trim().split(" ")[0];

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="halo absolute left-1/2 top-1/2 size-[50rem] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 animate-breathe blur-[100px]" />
        <div className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="shell relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-brand-soft/40 bg-brand/10">
            <svg
              viewBox="0 0 24 24"
              className="size-6 text-brand-soft"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m4 12.5 5 5L20 6.5" />
            </svg>
          </span>

          <h1 className="text-display mt-9 text-balance">
            {primeiroNome ? `Recebido, ${primeiroNome}.` : "Recebido."}
          </h1>

          <p className="text-lede mx-auto mt-6 max-w-[46ch] text-fog">
            {quente
              ? "Pelo que você respondeu, o seu caso merece conversa rápida. Retornamos em até 2 horas úteis, mas se quiser adiantar, é só chamar."
              : "Vamos montar o diagnóstico completo em cima das suas respostas e mandar no seu WhatsApp em até 24 horas úteis."}
          </p>

          {dados && (
            <div className="mt-10 rounded-2xl border border-chalk/8 bg-ink-2 p-6 text-left sm:p-7">
              <p className="text-eyebrow text-fog-dim">Sua leitura preliminar</p>
              <p className="text-subtitle mt-3 text-balance">{dados.diag.titulo}</p>
              <p className="mt-4 text-[0.875rem] leading-relaxed text-fog">
                {dados.diag.hipotese}
              </p>
            </div>
          )}

          <div className="mt-11 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              href={whatsappUrl("obrigado")}
              external
              size="lg"
              section="obrigado"
              ctaLabel="Adiantar no WhatsApp"
            >
              <WhatsAppIcon />
              Adiantar a conversa agora
              <ArrowIcon />
            </Button>
            <Link
              href="/"
              className="text-[0.875rem] text-fog transition-colors duration-300 hover:text-chalk"
            >
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
