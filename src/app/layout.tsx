import type { Metadata, Viewport } from "next";
import { Caveat, Source_Serif_4 } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "@/components/v3/ink/ink.css";

import { Analytics } from "@/components/analytics/Analytics";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { ConsentDefaultScript } from "@/components/analytics/ConsentDefaultScript";
import { WebVitals } from "@/components/analytics/WebVitals";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/layout/StickyCta";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { FAQ } from "@/lib/content";
import { SITE } from "@/lib/site";

/* -------------------------------------------------------------------------
   Tipografia.
   Inter Tight (títulos), Geist e Geist Mono são locais, sem requisição a
   terceiros. Caveat (notas à mão) e Source Serif 4 (só dentro da peça do
   cliente Sampaio) vêm do next/font/google, que as baixa no build e as serve
   do próprio domínio: o visitante também não fala com o Google.
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

const caveat = Caveat({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-serif",
  display: "swap",
  preload: false,
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

/**
 * FAQPage.
 *
 * As seis perguntas já existiam no site e não estavam marcadas. Marcar é de
 * graça e habilita o resultado expandido na busca, que ocupa mais espaço na
 * tela do que o link comum do concorrente.
 */
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      // O script inline abaixo grava `js` e `still` no <html> antes da primeira
      // pintura. O React precisa saber que essa diferença é intencional.
      suppressHydrationWarning
      className={`${interTight.variable} ${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${sourceSerif.variable} antialiased`}
    >
      <head>
        <ConsentDefaultScript />
        {/*
          Marca `js` no <html> antes da primeira pintura. É o `js` que liga o
          estado inicial escondido das animações de tinta (ink.css): sem
          script, tudo aparece pronto. `?still` pede o estado final sem
          animação, o mesmo que prefers-reduced-motion, e serve para print.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var c=document.documentElement.classList;c.add("js");if(location.search.indexOf("still")>-1)c.add("still")})();`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        <MotionProvider>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-chalk focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
          >
            Ir para o conteúdo
          </a>

          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <StickyCta />
        </MotionProvider>

        <Analytics />
        <WebVitals />
        <ConsentBanner />
      </body>
    </html>
  );
}
