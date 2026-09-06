/**
 * Configuração central da Versa.
 * Tudo que muda com o tempo (contatos, links, URL de produção) vive aqui.
 */

const WHATSAPP_NUMBER = "5568992380529"; // formato internacional, só dígitos
const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Versa e quero falar sobre um projeto.";

export const SITE = {
  name: "Versa",
  legalName: "Versa — Tecnologia, Design e Performance",
  /** Trocar pelo domínio final antes do deploy. Usado em SEO, sitemap e OG. */
  url: "https://versa.com.br",
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

  nav: [
    { label: "Serviços", href: "#servicos" },
    { label: "Método", href: "#processo" },
    { label: "Trabalhos", href: "#trabalhos" },
    { label: "Tecnologia", href: "#tecnologia" },
    { label: "Dúvidas", href: "#faq" },
  ],
} as const;

export const CTA = {
  primary: "Falar com a Versa",
  primaryShort: "Falar no WhatsApp",
  secondary: "Ver trabalhos",
} as const;
