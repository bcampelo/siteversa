import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidade e dados",
  description:
    "O que a Versa coleta, por que coleta e como você pede a exclusão dos seus dados.",
  alternates: { canonical: "/privacidade" },
};

/**
 * Página de privacidade.
 *
 * Escrita em português de gente, não em juridiquês copiado. Uma empresa que
 * vende medição precisa explicar a própria medição melhor do que a média,
 * senão o discurso não fecha.
 */
export default function PrivacidadePage() {
  return (
    <section className="relative pb-28 pt-32 sm:pt-40">
      <div className="shell">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="text-eyebrow text-fog-dim transition-colors duration-300 hover:text-chalk"
          >
            ← Versa
          </Link>

          <h1 className="text-display mt-7 text-balance">Privacidade e dados</h1>
          <p className="mt-5 text-[0.875rem] text-fog-dim">
            Última atualização: setembro de 2026.
          </p>

          <div className="mt-14 flex flex-col gap-10 text-[0.9375rem] leading-relaxed text-fog">
            <Bloco titulo="O que coletamos">
              <p>
                Duas coisas, e só. Primeiro, o que você digita por vontade
                própria em um formulário: nome, WhatsApp, e-mail quando você
                preenche, e as respostas do diagnóstico. Segundo, dados de
                navegação anônimos, como páginas visitadas, origem da visita e
                cliques em botão.
              </p>
              <p>
                Não pedimos CPF, não pedimos dado bancário e não coletamos
                nada sensível.
              </p>
            </Bloco>

            <Bloco titulo="Por que coletamos">
              <p>
                Os dados de contato servem para responder você e preparar a
                conversa. Os dados de navegação servem para entender o que
                funciona no site e onde as pessoas desistem. É o mesmo trabalho
                que fazemos para nossos clientes, aplicado em nós.
              </p>
            </Bloco>

            <Bloco titulo="Cookies e ferramentas de medição">
              <p>
                Usamos Google Analytics e, quando você aceita, o pixel da Meta.
                Enquanto você não aceitar, essas ferramentas ficam em modo
                restrito e não gravam cookie de identificação. Você pode mudar
                a escolha a qualquer momento limpando os dados do site no seu
                navegador.
              </p>
            </Bloco>

            <Bloco titulo="Com quem compartilhamos">
              <p>
                Não vendemos e não repassamos sua lista para ninguém. Os dados
                ficam em serviços que usamos para operar: Supabase (banco),
                Vercel (hospedagem), Google e Meta (medição de anúncio) e o
                serviço de e-mail que envia a notificação interna.
              </p>
            </Bloco>

            <Bloco titulo="Por quanto tempo guardamos">
              <p>
                Contatos comerciais ficam enquanto a relação fizer sentido.
                Se você pedir exclusão, apagamos em até 15 dias e confirmamos
                por escrito.
              </p>
            </Bloco>

            <Bloco titulo="Seus direitos">
              <p>
                Pela LGPD você pode pedir acesso, correção, portabilidade ou
                exclusão dos seus dados, e pode revogar o consentimento. Basta
                escrever para{" "}
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="link-underline text-chalk"
                >
                  {SITE.contact.email}
                </a>
                . Respondemos em até 15 dias.
              </p>
            </Bloco>

            <Bloco titulo="Quem é o responsável">
              <p>
                {SITE.legalName}, {SITE.city} · {SITE.state}. Contato para
                assuntos de dados:{" "}
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="link-underline text-chalk"
                >
                  {SITE.contact.email}
                </a>
                .
              </p>
            </Bloco>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bloco({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-subtitle text-chalk">{titulo}</h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}
