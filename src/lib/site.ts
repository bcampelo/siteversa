/**
 * Configuração central da Versa.
 * Tudo que muda com o tempo (contatos, links, URL de produção) vive aqui.
 */

import { PUBLIC_ENV } from "@/lib/env";

const WHATSAPP_NUMBER = "5568992380529"; // formato internacional, só dígitos
const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Versa e quero falar sobre um projeto.";

export const SITE = {
  name: "Versa",
  legalName: "Versa, Tecnologia, Design e Performance",
  /**
   * Vem de NEXT_PUBLIC_SITE_URL. Em desenvolvimento cai em localhost.
   * Alimenta SEO, canonical, sitemap, robots e Open Graph, então precisa
   * ser o domínio real em produção e não pode ser esquecido no deploy.
   */
  url: PUBLIC_ENV.siteUrl,
  locale: "pt-BR",
  tagline: "Tecnologia, design e mídia paga sob o mesmo teto.",
  description:
    "A Versa é uma empresa de tecnologia que une design, engenharia e mídia paga para transformar presença digital em crescimento real. Identidade visual, tráfego pago e sites que convertem.",
  city: "Rio Branco",
  state: "AC",
  country: "BR",
  founded: "2026",

  contact: {
    email: "contatoversa.org@gmail.com",
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappDisplay: "+55 (68) 99238-0529",
    whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_MESSAGE,
    )}`,
    instagramHandle: "@helloversa",
    instagram: "https://instagram.com/helloversa",
  },

  // Âncoras da home v3. As outras rotas continuam acessíveis por URL e pelo rodapé.
  nav: [
    { label: "Serviços", href: "/#servicos" },
    { label: "Trabalhos", href: "/#trabalhos" },
    { label: "Como funciona", href: "/#como" },
  ],
} as const;

/**
 * Textos de CTA.
 *
 * A regra que vale para todos: um CTA precisa responder "o que eu recebo se
 * clicar?". "Falar com a Versa" respondia "uma conversa de vendas", que é o
 * compromisso mais caro possível oferecido no momento de menor confiança.
 */
export const CTA = {
  primary: "Rodar o diagnóstico gratuito",
  primaryShort: "Diagnóstico gratuito",
  secondary: "Ver trabalhos",
  whatsapp: "Falar no WhatsApp",
  /** CTA principal da home v3: leva ao WhatsApp, com origem por seção. */
  falar: "Falar com a Versa",
} as const;

/** Destino do CTA principal do site. Um lugar só para trocar depois. */
export const DIAGNOSTICO_HREF = "/diagnostico";
