/**
 * Links de WhatsApp com origem.
 *
 * Antes, os nove pontos de contato do site mandavam a mesma frase. O
 * comercial abria a conversa sem saber de onde a pessoa veio nem o que ela
 * estava lendo. Aqui cada origem tem a própria mensagem, então o atendimento
 * já começa no assunto certo e a origem fica registrada mesmo sem ferramenta
 * de analytics nenhuma, porque ela viaja dentro do texto.
 *
 * Arquivo puro de propósito: é usado tanto em componente de servidor
 * (Footer) quanto de cliente (Header).
 */

import { SITE } from "@/lib/site";

export type WhatsAppSource =
  | "header"
  | "hero"
  | "menu-mobile"
  | "servicos"
  | "servico-design"
  | "servico-trafego"
  | "servico-web"
  | "servico-sistema"
  | "servico-nfc"
  | "trabalhos"
  | "faq"
  | "footer"
  | "cta-final"
  | "sticky-mobile"
  | "diagnostico-quente"
  | "obrigado";

const MESSAGES: Record<WhatsAppSource, string> = {
  header: "Olá! Vim pelo site da Versa e quero falar sobre um projeto.",
  hero: "Olá! Vim pelo site da Versa e quero falar sobre um projeto.",
  "menu-mobile": "Olá! Vim pelo site da Versa e quero falar sobre um projeto.",
  servicos:
    "Olá! Vim pelo site da Versa. Não sei bem por onde começar e queria entender qual frente resolve o meu caso.",
  "servico-design":
    "Olá! Vim pelo site da Versa. Quero falar sobre identidade visual e design.",
  "servico-trafego":
    "Olá! Vim pelo site da Versa. Quero falar sobre gestão de tráfego pago.",
  "servico-web":
    "Olá! Vim pelo site da Versa. Quero falar sobre site ou landing page.",
  "servico-sistema":
    "Olá! Vim pelo site da Versa. Quero conversar sobre um sistema para a minha empresa.",
  "servico-nfc":
    "Olá! Vim pelo site da Versa. Quero saber da placa NFC de avaliação no Google.",
  trabalhos:
    "Olá! Vim pelo site da Versa. Vi os trabalhos de vocês e quero um resultado parecido.",
  faq: "Olá! Vim pelo site da Versa. Fiquei com uma dúvida que não estava no FAQ.",
  footer: "Olá! Vim pelo site da Versa e quero falar sobre um projeto.",
  "cta-final":
    "Olá! Vim pelo site da Versa. Li o site inteiro e quero uma análise do meu caso.",
  "sticky-mobile": "Olá! Vim pelo site da Versa e quero falar sobre um projeto.",
  "diagnostico-quente":
    "Olá! Acabei de rodar o diagnóstico no site da Versa e quero falar sobre o resultado.",
  obrigado:
    "Olá! Preenchi o diagnóstico no site da Versa e queria adiantar a conversa.",
};

/** Link base, sem atribuição. Seguro para renderizar no servidor. */
export function whatsappUrl(source: WhatsAppSource): string {
  const text = MESSAGES[source] ?? MESSAGES.header;
  return `https://wa.me/${SITE.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Acrescenta a campanha de origem ao final da mensagem, no clique.
 * Só roda no cliente, porque o servidor não conhece a atribuição do visitante.
 */
export function withCampaignTag(
  href: string,
  campaign?: string,
  sourceName?: string,
): string {
  if (!campaign && !sourceName) return href;
  try {
    const url = new URL(href);
    const current = url.searchParams.get("text") ?? "";
    const tag = [sourceName, campaign].filter(Boolean).join(" / ");
    url.searchParams.set("text", `${current}\n\n[origem: ${tag}]`);
    return url.toString();
  } catch {
    return href;
  }
}
