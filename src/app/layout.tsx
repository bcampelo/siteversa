import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SITE } from "@/lib/site";

/* -------------------------------------------------------------------------
   Tipografia — 100% auto-hospedada (arquivos em src/fonts).
   Nenhuma requisição a servidor de terceiros: menos latência, menos
   dependência externa e nada de dados do visitante saindo do domínio.
   As três primeiras são variáveis: um arquivo cobre toda a faixa de peso.

   - Inter Tight: display. Grotesca tensa, a mesma linguagem das peças da
     marca, com tracking negativo nos títulos grandes.
   - Geist: texto corrido, excelente leitura em fundo escuro.
   - Geist Mono: rótulos, índices e código — o "sotaque" tecnológico.
   - Instrument Serif itálico: acento editorial, usado com parcimônia.
   ------------------------------------------------------------------------- */
const interTight = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const geistSans = localFont({
  src: "../fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});

const instrumentSerif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", style: "italic" },
  ],
  variable: "--font-instrument-serif",
  weight: "400",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "agência de marketing digital",
    "tráfego pago",
    "Meta Ads",
    "Google Ads",
    "identidade visual",
    "design gráfico",
    "criação de sites",
    "landing page",
    "Next.js",
    "empresa de tecnologia",
    "Rio Branco",
    "Acre",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#08070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  legalName: SITE.legalName,
  description: SITE.description,
  url: SITE.url,
  email: SITE.contact.email,
  telephone: `+${SITE.contact.whatsappNumber}`,
  foundingDate: SITE.founded,
  areaServed: { "@type": "Country", name: "Brasil" },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    addressCountry: SITE.country,
  },
  sameAs: [SITE.contact.instagram],
  knowsAbout: [
    "Design gráfico",
    "Identidade visual",
    "Tráfego pago",
    "Meta Ads",
    "Google Ads",
    "Desenvolvimento web",
    "Next.js",
    "Inteligência artificial aplicada",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços Versa",
    itemListElement: [
      "Design Gráfico e Identidade Visual",
      "Gestão de Tráfego Pago",
      "Sites Institucionais e Landing Pages",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      // O script inline abaixo grava `data-intro` no <html> antes da primeira
      // pintura. O React precisa saber que essa diferença é intencional.
      suppressHydrationWarning
      className={`${interTight.variable} ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        {/*
          Decide antes da primeira pintura se a intro de marca vai rodar, e
          marca a decisão no <html>. O CSS do hero lê esse atributo para
          sincronizar (ou zerar) o atraso da revelação, e o Preloader lê o
          mesmo atributo para saber se deve se montar.

          Regras: só em desktop (no celular a intro custaria o que mais
          importa — velocidade), nunca em `prefers-reduced-motion`, e uma vez
          só por sessão.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;if(!window.matchMedia("(min-width:1024px)").matches)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem("versa:intro")==="1")return;sessionStorage.setItem("versa:intro","1");d.setAttribute("data-intro","1");setTimeout(function(){d.setAttribute("data-intro-done","")},2150)}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <MotionProvider>
          <SmoothScroll />
          <ScrollProgress />
          <Preloader />

          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-chalk focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
          >
            Ir para o conteúdo
          </a>

          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
        </MotionProvider>

        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
